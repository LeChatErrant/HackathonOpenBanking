import cognitive_face as cf
import cv2
import time

def identify_person(face_ids, PERSON_GROUP_ID) :
    identified_faces = cf.face.identify(face_ids, PERSON_GROUP_ID)
    db = cf.person.lists(PERSON_GROUP_ID)

    if (len(identified_faces) == 0 or len(identified_faces[0]['candidates']) == 0) :
        return (False)
    for person in db :
        if (person['personId'] == identified_faces[0]['candidates'][0]['personId']) :
            print("Hello ", person['name'], "!")
            return (True)
    return (False)

def shoot(cap) :
    ret = True

    print("Just stay in front of me I will take a photo !")
    while (True) :
        for i in range(3, 0, -1) :
            time.sleep(1.5)
            print(i)
        time.sleep(1)
        print("SNAPE")
        _, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        face = face_cascade.detectMultiScale(gray, 1.3, 7)
        if (len(face) != 1) :
            print("An error occured ...")
            time.sleep(0.8)
            print("Lets retry !")
            time.sleep(1)
            continue
            cap.release()
            cap = cv2.VideoCapture(0)
            ret = False
        print("Yeah !\nNow let me register you on the data base !")
        cv2.imwrite("./register.jpg", frame)
        try :
            cf.person.add_face('./register.jpg', PERSON_GROUP_ID, person_id)
        except :
            print("An error occured ...")
            time.sleep(0.8)
            print("Lets retry !")
            time.sleep(1)
            cap.release()
            cap = cv2.VideoCapture(0)
            ret = False
            continue
        break
    return(ret)

def enumDataBase(groupe_id) :
    db = cf.person.lists(groupe_id)
    n = len(db) - 1

    for person in db :
        if int(person["userData"]) != n :
            cf.person.update(groupe_id, person["personId"], user_data=str(n))
        print(person["name"], " - ", person["userData"])
        n -= 1

def removeFromDataBase(groupe_id, name) :
    db = cf.person.lists(groupe_id)

    for person in db :
        if person["name"] == name :
            cf.person.delete(groupe_id, person["personId"])

KEY = 'f76bc5e810ca4526bdfa4d31923b1f7c'
BASE_URL = 'https://eastus.api.cognitive.microsoft.com/face/v1.0'
PERSON_GROUP_ID = 'known-persons'
face_cascade = cv2.CascadeClassifier('../inMoov/cascade_classifier/haarcascade_frontalface_default.xml')

cf.Key.set(KEY)
cf.BaseUrl.set(BASE_URL)
cap = cv2.VideoCapture(0)

reg = 0

enumDataBase(PERSON_GROUP_ID)
removeFromDataBase(PERSON_GROUP_ID, "Toto")

#for i in range(10) :
_, frame = cap.read()
#    cv2.imshow("feed", frame)
#    cv2.waitKey(1)

gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
face = face_cascade.detectMultiScale(gray, 1.3, 7)

while (True) :
    #cv2.imshow("feed", frame)
    #cv2.waitKey(1)
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face = face_cascade.detectMultiScale(gray, 1.3, 7)

    if len(face) == 1 :
        cv2.imwrite("./verif_frame.jpg", frame)
        response = cf.face.detect('./verif_frame.jpg')
        face_ids = [d['faceId'] for d in response]
        if (len(face_ids) >= 1 and identify_person(face_ids, PERSON_GROUP_ID) == True) :
            exit()
        else :
            print("Uknown person ...")
            reg += 1
            cap.release()
            cap = cv2.VideoCapture(0)
    if reg == 3 :
        cv2.destroyAllWindows()
        print("I can't recognizing you ...\nMaybe I dont know you ?")
        if (input("would you like to register ? (y/n)") == "y") :
            name = input("ok lets go !\nType your name : ")
            response = cf.person.create(PERSON_GROUP_ID, name, str(len(cf.person.lists(PERSON_GROUP_ID))))
            person_id = response['personId']
            if shoot(cap) == False :
                cap.release()
                cap = cv2.VideoCapture(0)
            print("Training phase ...")
            cf.person_group.train(PERSON_GROUP_ID)
            print("Alright I will remember you !")
            reg = 0
        else :
            exit()
