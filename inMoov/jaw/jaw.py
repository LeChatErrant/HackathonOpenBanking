import fcntl
import sys
import os
import time
import tty
import termios
import serial

jaw = serial.Serial("/dev/ttyUSB0", 9600)
jaw_pos = 0
content = ""
speak_mode = False

def move_jaw(speak_mode) :
    global jaw_pos

    if speak_mode == False and jaw_pos == 0 :
        return
    elif speak_mode == False :
        jaw.write("j-30,\n".encode())
        #print("close")
    else :
        if jaw_pos == 0 :
            jaw.write("j30,\n".encode())
            #print("open")
        else :
            jaw.write("j-30,\n".encode())
            #print("close")
        jaw_pos = 0 if jaw_pos == 1 else 1

class raw(object):
    def __init__(self, stream):
        self.stream = stream
        self.fd = self.stream.fileno()
    def __enter__(self):
        self.original_stty = termios.tcgetattr(self.stream)
        tty.setcbreak(self.stream)
    def __exit__(self, type, value, traceback):
        termios.tcsetattr(self.stream, termios.TCSANOW, self.original_stty)

class nonblocking(object):
    def __init__(self, stream):
        self.stream = stream
        self.fd = self.stream.fileno()
    def __enter__(self):
        self.orig_fl = fcntl.fcntl(self.fd, fcntl.F_GETFL)
        fcntl.fcntl(self.fd, fcntl.F_SETFL, self.orig_fl | os.O_NONBLOCK)
    def __exit__(self, *args):
        fcntl.fcntl(self.fd, fcntl.F_SETFL, self.orig_fl)

with raw(sys.stdin):
    with nonblocking(sys.stdin):
        while True:
            try:
                content = sys.stdin.read(10)
                if content == "q" :
                    break
                if content == "j" :
                    speak_mode = True
                if content == "s" :
                    speak_mode = False
                move_jaw(speak_mode)
            except IOError:
                print('not ready')
            time.sleep(.2)

jaw.close()