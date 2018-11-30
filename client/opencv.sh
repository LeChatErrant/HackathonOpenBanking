#! /bin/bash

set -euf -o pipefail

function cleanup {
    for pid in "${opencv_download_pid:-''}" "${contrib_download_pid:-''}" "${pip_install_pid:-''}"; do
        if [ -z "${pid}" ]; then
            kill "${pid}"
        fi
    done
}
trap cleanup EXIT

totmem="$(free --total --bytes | grep 'Total:' | tr --squeeze-repeats ' ' | cut -d' ' -f 2)"
if [ "${totmem}" -lt 2535641088 ]; then
    echo "Please increase total memory + swap to at least ~2G (currently ${totmem} bytes)"
    exit 1
fi

cpucount="$(nproc)"
if [ "${cpucount}" -gt 1 ]; then
    APT_EXTRAS="libtbb2 libtbb-dev"
    CMAKE_EXTRAS="-D WITH_TBB=ON -D BUILD_TBB=ON"
fi

dest="/opt/opencv"
mkdir -p "${dest}"
pushd "${dest}" &> /dev/null

latest_python="$(ls /opt/pyenv/versions/ | sort -n | tail -n 1)"
python_root="/opt/pyenv/versions/${latest_python}"

latest_release="$(curl -s http://opencv.org/releases.html | \
                  grep -o '/[0-9.]\+\.zip' | \
                  sort | \
                  tail -n 1 | \
                  tr -d '/' | \
                  sed 's/\.zip$//'
                  )"

# Download and unzip in the background
(
    wget --quiet --no-clobber --output-document opencv.zip "https://github.com/opencv/opencv/archive/${latest_release}.zip"
    unzip opencv.zip
) &
opencv_download_pid=$!

(
    wget --quiet --no-clobber --output-document contrib.zip "https://github.com/opencv/opencv_contrib/archive/${latest_release}.zip"
    unzip contrib.zip
) &
contrib_download_pid=$!

sudo apt install \
    build-essential \
    cmake \
    git \
    libgtk2.0-dev \
    pkg-config \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libjasper-dev \
    libdc1394-22-dev \
    libatlas-base-dev \
    gfortran \
    libeigen3-dev \
    ${APT_EXTRAS:-''} \
    &
apt_pid=$!

"${python_root}"/bin/python -m pip install --upgrade numpy

while ps -p "${opencv_download_pid}" "${contrib_download_pid}" "${apt_pid}" > /dev/null; do
    echo "Waiting for downloads..."
    sleep 10
done

build_dir=opencv-"${latest_release}"/build
mkdir -p "${build_dir}"
pushd "${build_dir}" &> /dev/null

make clean

cmake \
    -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-"${latest_release}"/modules \
    -D BUILD_EXAMPLES=ON \
    -D PYTHON3_EXECUTABLE="${python_root}/bin/python" \
    -D PYTHON_INCLUDE_DIR="${python_root}/include/python${latest_python%.*}m" \
    -D PYTHON_LIBRARY="${python_root}/lib/libpython${latest_python%.*}m.a" \
    -D PYTHON3_PACKAGES_PATH="${python_root}/lib/python${latest_python%.*}/site-packages" \
    -D PYTHON3_NUMPY_INCLUDE_DIRS="${python_root}/lib/python${latest_python%.*}/site-packages/numpy/core/include" \
    -D BUILD_opencv_python3=ON \
    -D WITH_EIGEN=ON \
    ${CMAKE_EXTRAS:-''} \
    ..

jobs="$(( "${cpucount}" > 2 ? "${cpucount}" - 1 : 1 ))"
make -j"${jobs}"

sudo make install
sudo ldconfig

popd &> /dev/null
rm *.zip
popd &> /dev/null