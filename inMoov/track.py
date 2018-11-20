from utils import *
import random
import time
import cv2

class Tracking :
    def __init__(self) :
        self.tracked_object = [winW / 2, winH / 2]
        self.face_cascade = cv2.CascadeClassifier('cascade_classifier/lbpcascade_frontalface_improved.xml')
        self.clock = 0
        self.wait = random.randint(3, 7)
        self.nb_rotation = 0
        self.dir = {'X' : 0, 'Y' : 0}
        
    def tracker(self, frame, neck) :
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face = self.face_cascade.detectMultiScale(gray, 1.3, 7)
        
        positions = [[int(x + w / 2), int(y + h / 2)] for (x, y, w, h) in face]
        positions.sort(key=lambda pos : abs(winW / 2 - pos[0]) + abs(winH / 2 - pos[1]))
        if len(positions) > 0 :
            self.tracked_object = positions[0]
            self.clock = 0
            self.nb_rotation = 0
            self.dir = {'X' : 0, 'Y' : 0}
        else :
            self.tracked_object = [winW / 2, winH / 2]
            if self.nb_rotation == 0 and not self.clock :
                self.clock = time.time()
            
            elif self.nb_rotation == 0 and time.time() - self.clock > self.wait :
                # calc for X axis
                self.dir['X'] = -(neck.currentHeadDegreeX - BaseHeadDegreeX)
                if self.dir['X'] == 0 :
                    self.dir['X'] = -1 if random.randint(0, 1) == 0 else 1
                self.dir['X'] = self.dir['X'] / abs(self.dir['X'])
                rotation_max = abs(90 + self.dir['X'] * 70 - neck.currentHeadDegreeX) / 2
                self.nb_rotation = random.randint(10, int(rotation_max) - 15)
                
                # calc for Y axis
                self.dir['Y'] = -(neck.currentHeadDegreeY - BaseHeadDegreeY)