#!/usr/bin/env python3
import sys
import serial
import time
import wave
import numpy as np
import pyaudio


CHUNK = 1024

unplug = False

if (len(sys.argv) > 1 and sys.argv[1] == "--unplugged") :
    unplug = True

if not unplug :
    jaw = serial.Serial("/dev/ttyUSB0", 9600)

currentJawPos = 45

def move_jaw(val) :
    global currentJawPos
    update_pos = int(val * 115 / 100)
    diff = update_pos - currentJawPos
    currentJawPos = currentJawPos + diff

    if not unplug :
        str_diff = "j" + str(diff) + ",\n"
        jaw.write(str_diff.encode())

maxPeak = 0;
stream = 0
p=pyaudio.PyAudio()

def play_audio(in_data, frame_count, time_info, status):
    audio = wf.readframes(CHUNK)
    peak = np.average(np.abs(np.fromstring(audio,dtype=np.int16)))
    move_jaw(int(peak/maxPeak))
    return (audio, pyaudio.paContinue)

while True:

    wf = wave.open(input(), 'rb')

    audio = wf.readframes(CHUNK)

    while audio != b'':
        peak = np.average(np.abs(np.fromstring(audio,dtype=np.int16)))/100
        if peak > maxPeak:
            maxPeak = peak
        audio = wf.readframes(CHUNK)

    wf.rewind()

    if stream == 0:
        stream=p.open(format=p.get_format_from_width(wf.getsampwidth()),
                        channels=wf.getnchannels(),
                        rate=wf.getframerate(),
                        output=True,
                        stream_callback= play_audio)
    else:
        stream.stop_stream()
        stream.close()
        stream=p.open(format=p.get_format_from_width(wf.getsampwidth()),
                        channels=wf.getnchannels(),
                        rate=wf.getframerate(),
                        output=True,
                        stream_callback= play_audio)

    stream.start_stream()

    while stream.is_active():
        time.sleep(0.1)
    move_jaw(0)
    print("DONE")

stream.stop_stream()
stream.close()
p.terminate()
jaw.close()
