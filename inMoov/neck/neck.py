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

    def animateNeck(self, ref, head) :        
        if ref.tracked_object[0] < self.neckLim['left'] and self.currentHeadDegreeX + 1 <= 160 :
            self.currentHeadDegreeX += 1
            head.write("x1,\n".encode())
        elif ref.tracked_object[0] > self.neckLim['right'] and self.currentHeadDegreeX - 1 >= 20 :
            self.currentHeadDegreeX -= 1
            head.write("x-1,\n".encode())
        
        if ref.tracked_object[1] < self.neckLim['top'] and self.currentHeadDegreeY + 1 <= 145 :
            self.currentHeadDegreeY += 1
            head.write("y1,\n".encode())
        elif ref.tracked_object[1] > self.neckLim['bot'] and self.currentHeadDegreeY - 1 >= 15 :
            self.currentHeadDegreeY -= 1
            head.write("y-1,\n".encode())
        time.sleep(0.05)

    def findPerson(self, track, head) :
        if track.dir['X'] > 0 and self.currentHeadDegreeX + 2 <= 160 :
            self.currentHeadDegreeX += 2
            head.write("x2,\n".encode())
        elif track.dir['X'] < 0 and self.currentHeadDegreeX - 2 >= 20 :
            self.currentHeadDegreeX -= 2
            head.write("x-2,\n".encode())
            
        if track.dir['Y'] > 0 and self.currentHeadDegreeY + 2 <= 90 :
            self.currentHeadDegreeY += 2
            head.write("y2,\n".encode())
        elif track.dir['Y'] < 0 and self.currentHeadDegreeY - 2 >= 90 :
            self.currentHeadDegreeY -= 2
            head.write("y-2,\n".encode())