import cv2
import random
from utils import *
from neck.neck import Neck
import serial
import time

class InMoov :
    def __init__(self, eyes_sens) :
        self.head = serial.Serial("/dev/ttyUSB0", 9600)
        self.neck = Neck()
        
        self.head.write("z0,\n".encode())

    def animateHead(self, track) :
        if not track.clock :
            self.neck.animateNeck(track, self.head)
        elif track.nb_rotation :
            track.nb_rotation -= 1
            self.neck.findPerson(track, self.head)
            if track.nb_rotation == 0 :
                track.clock = time.time()
                track.wait = random.randint(4, 10)

    def disp_map(self, img) :     
        cv2.rectangle(img, (self.neck.neckLim['left'], 0), (self.neck.neckLim['left'], winH), RED, 3)
        cv2.rectangle(img, (self.neck.neckLim['right'], 0), (self.neck.neckLim['right'], winH), RED, 3)
        cv2.rectangle(img, (0, self.neck.neckLim['top']), (winW, self.neck.neckLim['top']), RED, 3)
        cv2.rectangle(img, (0, self.neck.neckLim['bot']), (winW, self.neck.neckLim['bot']), RED, 3)        