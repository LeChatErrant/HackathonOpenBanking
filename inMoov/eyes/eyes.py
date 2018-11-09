from utils import percent_of

class Eyes :
    def __init__(self, eyes_coef) :
        winW = 640
        winH = 480
        self.eyesVector = [0, 0]
        self.eyesLimLeft = []
        self.eyesLimRight = []
        self.eyesLimTop = []
        self.eyesLimBot = []
        self.currentEyesDegreeX = 90
        self.currentEyesDegreeY = 90

    def turn_eyes(self, head) :
        print(self.currentEyesDegreeY)
        if (self.eyesVector[0] == 1 and self.currentEyesDegreeX + 5 <= 145) :
            head.write("x5,\n".encode())
            self.currentEyesDegreeX += 5
        elif (self.eyesVector[0] == -1 and self.currentEyesDegreeX - 5 >= 85) :
            self.currentEyesDegreeX -= 5
            head.write("x-5,\n".encode())
        if (self.eyesVector[1] == 1 and self.currentEyesDegreeY + 5 <= 145) :
            head.write("y5,\n".encode())
            self.currentEyesDegreeY += 5
        elif (self.eyesVector[1] == -1 and self.currentEyesDegreeY - 5 >= 20) :
            self.currentEyesDegreeY -= 5
            head.write("y-5,\n".encode())
        
    def EyeLimSensor(self, ref) :
        self.eyesVector = [0, 0]
        if (ref[0] > self.eyesLimLeft[0] and ref[0] < self.eyesLimLeft[1]) :
            self.eyesVector[0] = 1
        if (ref[0] > self.eyesLimRight[0] and ref[0] < self.eyesLimRight[1]) :
            self.eyesVector[0] = -1
        if (ref[1] > self.eyesLimTop[0] and ref[1] < self.eyesLimTop[1]) :
            self.eyesVector[1] = 1
        if (ref[1] > self.eyesLimBot[0] and ref[1] < self.eyesLimBot[1]) :
            self.eyesVector[1] = -1