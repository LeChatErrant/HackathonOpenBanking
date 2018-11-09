import cv2

class Tracking :
    def __init__(self) :
        self.tracked_object = [0, 0]
        self.face_cascade = cv2.CascadeClassifier('cascade_classifier/lbpcascade_frontalface_improved.xml')
        self.profil_cascade = cv2.CascadeClassifier('cascade_classifier/lbpcascade_profileface.xml')
        self.start = 0
        self.is_present = False

    def tracker(self, frame) :
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face = self.face_cascade.detectMultiScale(gray, 1.3, 7)
        mod = 0
        self.is_present = False
        
        for (x, y, w, h) in face :
            tmp_ref = [int(x + ((x + w) - x) / 2), int(y + ((y + h) - y) / 2)]
            cv2.circle(frame, (tmp_ref[0], tmp_ref[1]), 4, (255, 0, 0), 2)    
            if self.start == 0 :
                self.tracked_object = tmp_ref
                self.is_present = True
                self.start += 1
                mod = 1
            elif (tmp_ref[0] > self.tracked_object[0] - 40 and tmp_ref[0] < self.tracked_object[0] + 40 and tmp_ref[1] > self.tracked_object[1] - 40 and tmp_ref[1] < self.tracked_object[1] + 40) :
                self.tracked_object = tmp_ref
                self.is_present = True
                mod = 1
                break
        
        if mod != 0 :
            return
        profil = self.profil_cascade.detectMultiScale(gray, 1.3, 7)
        for (x, y, w, h) in profil :
            tmp_ref = [int(x + ((x + w) - x) / 2), int(y + ((y + h) - y) / 2)]
            cv2.circle(frame, (tmp_ref[0], tmp_ref[1]), 4, (255, 0, 0), 2)    
            if self.start == 0 :
                self.tracked_object = tmp_ref
                self.is_present = True
                self.start += 1
            elif (tmp_ref[0] > self.tracked_object[0] - 40 and tmp_ref[0] < self.tracked_object[0] + 40 and tmp_ref[1] > self.tracked_object[1] - 40 and tmp_ref[1] < self.tracked_object[1] + 40) :
                self.tracked_object = tmp_ref
                self.is_present = True
                break