# Colors
BLUE = (255, 0, 0)
GREEN = (0, 255, 0)
RED = (0, 0, 255)

# Window size
winW = 640
winH = 480

# NECK
BaseHeadDegreeX = 90
BaseHeadDegreeY = 90
neck_coef = 40

def moveHead(head, degree, eyes_pos) :
    if (degree[0] == 'x' and "-" in degree) :
        head.write("a1,\n".encode())
        eyes_pos = 1
    elif (degree[0] == 'x') :
        head.write("a0,\n".encode())
        eyes_pos = 2
    head.write(degree.encode())
        
        