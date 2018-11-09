import fcntl
import sys
import os
import time
import tty
import termios
import serial

unplug = False

if (len(sys.argv) > 1 and sys.argv[1] == "--unplugged") :
    unplug = True

if not unplug :
    jaw = serial.Serial("/dev/ttyUSB0", 9600)
jaw_pos = 0
content = ""
speak_mode = False

def move_jaw(speak_mode) :
    global jaw_pos
    global unplug

    if speak_mode == False and jaw_pos == 0 :
        return
    elif speak_mode == False :
        if not unplug :
            jaw.write("j-30,\n".encode())
    else :
        if jaw_pos == 0 :
            if not unplug :
                jaw.write("j30,\n".encode())
        else :
            if not unplug :
                jaw.write("j-30,\n".encode())
        jaw_pos = 0 if jaw_pos == 1 else 1

while True:
    try:
        content = input()
    except :
        break
    if (content != "DAB") :
        print(content)
    if content == "q" :
        break
    if content == "j" :
        speak_mode = True
    if content == "s" :
        speak_mode = False
    move_jaw(speak_mode)
    time.sleep(.1)

jaw.close()
