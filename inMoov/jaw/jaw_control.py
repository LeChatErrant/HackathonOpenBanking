import sys
import sys
import serial
import time

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
        #print(str_diff)
        jaw.write(str_diff.encode())

for val in sys.__stdin__ :
    if (val == "DONE\n"):
        print("Done")
    else:
        move_jaw(int(val))


jaw.close()
