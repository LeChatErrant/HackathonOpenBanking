import cv2
import keyboard
from inMoov import InMoov
from track import Tracking

start = 0
cam = cv2.VideoCapture(0)

inMoov = InMoov(25, 20)
track = Tracking()

while True :
    ret, frame = cam.read()
    track.tracker(frame)

    inMoov.animateHead(track.tracked_object)
    if (keyboard.is_pressed("m")) :
        cv2.waitKey(5)
        map = True if map == False else False
    if (map == True) :
        inMoov.disp_map(frame)
    if (keyboard.is_pressed(" ") and track.is_present) :
        print("Guillaumeuh")
    cv2.circle(frame, (track.tracked_object[0], track.tracked_object[1]), 4, (0, 0, 255), 2)
    cv2.imshow("acc_track", frame)
    cv2.waitKey(1)