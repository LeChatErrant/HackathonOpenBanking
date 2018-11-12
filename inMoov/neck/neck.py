from utils import percent_of

class Neck :
    def __init__(self, neck_coef) :
        winW = 640
        winH = 480
        self.neckVector = [0, 0]
        self.neckLimLeft = [0, int(percent_of(neck_coef, winW)) + 70]
        self.neckLimRight = [int(percent_of((100 - neck_coef * 2) + neck_coef, winW)), winW]
        self.neckLimTop = [0, int(percent_of(neck_coef, winH)) + 70]
        self.neckLimBot = [int(percent_of((100 - neck_coef * 2) + neck_coef, winH)), winH]
        self.currentHeadDegreeX = 90
        self.currentHeadDegreeY = 90

    def animateNeck(self, head) :        
        print(self.neckVector)
        if (self.neckVector[0] == 1 and self.currentHeadDegreeX + 2 <= 160) :
            head.write("x2,\n".encode())
            self.currentHeadDegreeX += 2
        elif (self.neckVector[0] == -1 and self.currentHeadDegreeX - 2 >= 20) :
            self.currentHeadDegreeX -= 2
            head.write("x-2,\n".encode())
        if (self.neckVector[1] == 1 and self.currentHeadDegreeY + 2 <= 145) :
            head.write("y2,\n".encode())
            self.currentHeadDegreeY += 2
        elif (self.neckVector[1] == -1 and self.currentHeadDegreeY - 2 >= 20) :
            self.currentHeadDegreeY -= 2
            head.write("y-2,\n".encode())

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
