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

while audio != b'':
    peak=np.average(np.abs(np.fromstring(audio,dtype=np.int16)))/100
    if peak > maxPeak:
        maxPeak = peak
    audio = wf.readframes(CHUNK)

wf.rewind()
audio = wf.readframes(CHUNK)

while  audio != b'':
    stream.write(audio)
    peak = np.average(np.abs(np.fromstring(audio,dtype=np.int16)))
    print(int(peak/maxPeak))
    sys.stdout.flush()
    audio = wf.readframes(CHUNK)
stream.stop_stream()
stream.close()
p.terminate()