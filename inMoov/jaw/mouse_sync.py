import pyaudio
import wave
import sys
import numpy as np
import time

def play_file(fname):
    # create an audio object
    wf = wave.open(fname, 'rb')
    p = pyaudio.PyAudio()
    chunk = 1024

    # open stream based on the wave object which has been input.
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True)

    data = np.fromstring(wf.readframes(chunk),dtype=np.int16)

    # play stream (looping from beginning of file to the end)
    while data != [] :
        # writing to the stream is what *actually* plays the sound.
        stream.write(data)
        peak=np.average(np.abs(data))*10
        bars="#"*int(50*peak/2**16)
        print("%05d %s"%(peak,bars))
        data = np.fromstring(wf.readframes(chunk),dtype=np.int16)
        # cleanup stuff.
    stream.close()
    p.terminate() 

play_file(sys.argv[1])