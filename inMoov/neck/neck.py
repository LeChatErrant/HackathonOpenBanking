from utils import percent_of, moveHeadTo
import time

class Neck :
    def __init__(self, neck_coef) :
        winW = 640
        winH = 480
        left_bias = 70
        top_bias = 70
        self.time_ref = time.time()
        self.neckVector = [0, 0]
        self.neckLimLeft = [0, int(percent_of(neck_coef, winW)) + left_bias]
        self.neckLimRight = [int(percent_of((100 - neck_coef * 2) + neck_coef, winW)), winW]
        self.neckLimTop = [0, int(percent_of(neck_coef, winH)) + top_bias]
        self.neckLimBot = [int(percent_of((100 - neck_coef * 2) + neck_coef, winH)), winH]
        self.currentHeadDegreeX = 90
        self.currentHeadDegreeY = 90

    def animateNeck(self, head) :      
        print(self.neckVector)
        if (self.neckVector[0] == 1 and self.currentHeadDegreeX + 2 <= 160) :
            moveHeadTo(head, "x2")
            self.currentHeadDegreeX += 2
        elif (self.neckVector[0] == -1 and self.currentHeadDegreeX - 2 >= 20) :
            self.currentHeadDegreeX -= 2
            moveHeadTo(head, "x-2")
        if (self.neckVector[1] == 1 and self.currentHeadDegreeY + 2 <= 145) :
            moveHeadTo(head, "y2")
            self.currentHeadDegreeY += 2
        elif (self.neckVector[1] == -1 and self.currentHeadDegreeY - 2 >= 20) :
            self.currentHeadDegreeY -= 2
            moveHeadTo(head, "y-2")

    def neckLimSensor(self, ref) :
        self.neckVector = [0, 0]
        if (ref[0] > self.neckLimLeft[0] and ref[0] < self.neckLimLeft[1]) :
            self.neckVector[0] = 1
        if (ref[0] > self.neckLimRight[0] and ref[0] < self.neckLimRight[1]) :
            self.neckVector[0] = -1
        if (ref[1] > self.neckLimTop[0] and ref[1] < self.neckLimTop[1]) :
            self.neckVector[1] = 1
        if (ref[1] > self.neckLimBot[0] and ref[1] < self.neckLimBot[1]) :
            self.neckVector[1] = -1       
