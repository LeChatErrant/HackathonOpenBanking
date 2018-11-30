Hello welcome to the installer guide for Django the receptionist !

First we going to install all dependencies :
(depending on your distribution you should use apt, dnf or yum ...)

At the root of the repository :


    1 - Python3 :
Python3 is the version of python we used to program all features about the robot.
$> sudo apt install python3


    2 - pip3 :
pip3 is the installer environement for python3.
$> sudo apt install python3-pip


    3 - OpenCV :
OpenCV is the library we used for the robot vision.
$> sudo apt install opencv-python3


    4 - pyAudio :
We used pyAudio to annalyse audio spectrum to do a lip sync.
$> sudo apt install python3-pyAudio 


    5 - all program dependencies :
Then we going to install all dependencies the program need to work properly.
$> sudo pip3 install -r inMoov/requirment.txt


HOW TO RUN ?

$> cd inMoov/
$> sudo python3 main.py

ENJOY !