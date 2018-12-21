import pygame
import serial
from time import sleep

HEAD_DEGREE = 90

port = "/dev/ttyUSB0"
head = serial.Serial(port, 9600) 

pygame.init()
pygame.joystick.init()
joy = pygame.joystick.Joystick(0)
joy.init()

def move_head(dir, axis, head) :
    global HEAD_DEGREE
    speed = ((axis + 1) * 10 / 2) * -1 if dir == "left" else (axis + 1) * 10 / 2
    speed = int(speed) 
    if HEAD_DEGREE + speed > 180 :
        speed -= (HEAD_DEGREE + speed - 180)
    elif HEAD_DEGREE + speed < 0 :
        speed -= (HEAD_DEGREE + speed)
    data = "x" + str(speed) + ",\n"
    head.write(data.encode())
    HEAD_DEGREE += speed

        


while True:
    pygame.event.get()
    rt = joy.get_axis(5)
    lt = joy.get_axis(2)
    if rt == -1 and lt != -1 :
        move_head("right", lt, head)
    elif lt == -1 and rt != -1 :
        move_head("left", rt, head)
    print(HEAD_DEGREE)
    sleep(0.2)
    
