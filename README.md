# HackathonOpenBanking

This is a submission for the hackathon OpenBanking.
The final project is a full human sized robot, used as a receptionnist in bank.
The robot is able to recognize the client, to access his data, to understand him, to speak and keep eye contact with him, and come with a Progressiv Web Apps, allowing banker to easily handle his disponibilities and appointments, and to be notified when clients wants to join him.


## Architecture

  - InMoov contains all the InMoov (the robot) related files, including Face tracking, servo motor controllers, jaw controller, and face recognition.
  - Client_chatbot contains all the "ear and mouth" files, allowing the robot to ear the user, and to reply with vocal. It includes assistant algorithm to detect when the user is talking or not, to fluidify the conversation.
  - Server contains the back-end server, allowing dialogflow to make fulfillment request, and to add back-end logic (connection to Database, conditionnal completion considering user data, and more).
  - Application contains the application, used to display and handle disponibilities and appointments. It is a PWA, a progressive WebApps, and can be used as a website AND a native mobile application.

## Launch guide

Every part of the project contain its own launch guide at their root.

## Technologies

  - Hardware :
    - RaspberryPI 3
    - Arduinos and C lite
  
  - Backend :
    - Node.js
    - Firebase
    - AzureVM
    
  - Client : 
    - Node.js
    - Dialogflow
    
  - Robot :
    - OpenCV2
    - Python
    - Azure Cognitive Face API
    
  - Application : 
    - AngularJS
    - TypeScript
    - HTML5 / SCSS
    - PWA
    
    
