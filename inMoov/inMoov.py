import cv2
from utils import percent_of
from neck.neck import Neck
import serial
import time

class InMoov :
    def __init__(self, neck_coef, eyes_sens) :
        self.head = serial.Serial("/dev/ttyUSB0", 9600)
        self.neck = Neck(neck_coef)
        
        
        self.head.write("z0,\n".encode())

    def animateHead(self, track) :
        if track.is_present :
            self.neck.neckLimSensor(track.tracked_object)
            self.neck.animateNeck(self.head)

    def disp_map(self, img) :
        winW = 640
        winH = 480
        headRect1 = {'A': (0, 0), 'B': (self.neck.neckLimLeft[1], winH)}
        headRect2 = {'A': (0, 0), 'B': (winW, self.neck.neckLimTop[1])}
        headRect3 = {'A': (winW, 0), 'B': (self.neck.neckLimRight[0], winH)}
        headRect4 = {'A': (0, winH), 'B': (winW, self.neck.neckLimBot[0])}
        
        cv2.rectangle(img, headRect1['A'], headRect1['B'], (0, 0, 255), 3)
        cv2.rectangle(img, headRect2['A'], headRect2['B'], (0, 0, 255), 3)
        cv2.rectangle(img, headRect3['A'], headRect3['B'], (0, 0, 255), 3)
        cv2.rectangle(img, headRect4['A'], headRect4['B'], (0, 0, 255), 3)        


