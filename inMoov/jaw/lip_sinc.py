#!/usr/bin/env python3

import pyaudio
import sys
import wave
import numpy as np

CHUNK = 1024

if len(sys.argv) < 2:
    print("Plays a wave file.\n\nUsage: %s filename.wav" % sys.argv[0])
    sys.exit(-1)

wf = wave.open(sys.argv[1], 'rb')

p=pyaudio.PyAudio()
stream=p.open(format=p.get_format_from_width(wf.getsampwidth()),
                channels=wf.getnchannels(),
                rate=wf.getframerate(),
                output=True, input=False)

audio = wf.readframes(CHUNK)

maxPeak = 0;

print('------start process------')
while audio != b'':
    peak=np.average(np.abs(np.fromstring(audio,dtype=np.int16)))/100
    if peak > maxPeak:
        maxPeak = peak
    audio = wf.readframes(CHUNK)
print(int(maxPeak), '= 100%')
print('--------end--------')

wf.rewind()
audio = wf.readframes(CHUNK)

print('------start lip sync-------')
while  audio != b'':
    stream.write(audio)
    peak = np.average(np.abs(np.fromstring(audio,dtype=np.int16)))
    print(int(peak/maxPeak), '%')
    audio = wf.readframes(CHUNK)
print('------------end------------')
stream.stop_stream()
stream.close()
p.terminate()