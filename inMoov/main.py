from utils import *
import cv2
import keyboard
from inMoov import InMoov
from track import Tracking

cam = cv2.VideoCapture(2)
inMoov = InMoov(20)
track = Tracking()

while True :
    ret, frame = cam.read()
    track.tracker(frame, inMoov.neck)

    inMoov.animateHead(track)
    if (keyboard.is_pressed("m")) :
        cv2.waitKey(10)
        map = not map
    if (map) :
        inMoov.disp_map(frame)

    if keyboard.is_pressed(" ") :
        break
    cv2.circle(frame, (int(track.tracked_object[0]), int(track.tracked_object[1])), 4, RED, 3)
    tmp = cv2.resize(frame, (840, 525))
    cv2.imshow("acc_track", tmp)
    cv2.waitKey(1)
