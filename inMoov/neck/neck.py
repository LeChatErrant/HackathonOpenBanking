from utils import *
import time

class Neck :
    def __init__(self) :         
        self.neckLim = {'left' : int(neck_coef * winW / 100),
                        'right' : int(winW - neck_coef * winW / 100),
                        'top' : int(neck_coef * winH / 100),
                        'bot' : int(winH - neck_coef * winH / 100)}
        self.currentHeadDegreeX = BaseHeadDegreeX
        self.currentHeadDegreeY = BaseHeadDegreeY
        self.eyes_pos = 0

    def animateNeck(self, ref, head) :        
        if ref.tracked_object[0] < self.neckLim['left'] and self.currentHeadDegreeX + 1 <= 160 :
            self.currentHeadDegreeX += 1
            moveHead(head, "x1,\n", self.eyes_pos)
        elif ref.tracked_object[0] > self.neckLim['right'] and self.currentHeadDegreeX - 1 >= 20 :
            self.currentHeadDegreeX -= 1
            moveHead(head, "x-1,\n", self.eyes_pos)
        else :    
            head.write("r0,\n".encode())            
        
        if ref.tracked_object[1] < self.neckLim['top'] and self.currentHeadDegreeY + 2 <= 145 :
            self.currentHeadDegreeY += 2
            moveHead(head, "y2,\n", self.eyes_pos)
        elif ref.tracked_object[1] > self.neckLim['bot'] and self.currentHeadDegreeY - 2 >= 15 :
            self.currentHeadDegreeY -= 2
            moveHead(head, "y-2,\n", self.eyes_pos)
        time.sleep(0.05)

    def findPerson(self, track, head) :
        if track.dir['X'] > 0 and self.currentHeadDegreeX + 2 <= 160 :
            self.currentHeadDegreeX += 2
            moveHead(head, "x2,\n", self.eyes_pos)
        elif track.dir['X'] < 0 and self.currentHeadDegreeX - 2 >= 20 :
            self.currentHeadDegreeX -= 2
            moveHead(head, "x-2,\n", self.eyes_pos)
            
        if track.dir['Y'] > 0 and self.currentHeadDegreeY + 2 <= 90 :
            self.currentHeadDegreeY += 2
            moveHead(head, "y2,\n", self.eyes_pos)
        elif track.dir['Y'] < 0 and self.currentHeadDegreeY - 2 >= 90 :
            self.currentHeadDegreeY -= 2
            moveHead(head, "y-2,\n", self.eyes_pos)