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

while True:
    try:
        content = input()
    except :
        break
    if content == "q" :
        break
    if content == "j" :
        speak_mode = True
    if content == "s" :
        speak_mode = False
    move_jaw(speak_mode)
    time.sleep(.2)

jaw.close()