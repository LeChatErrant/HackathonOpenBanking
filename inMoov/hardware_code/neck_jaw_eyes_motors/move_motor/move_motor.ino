#include <Servo.h>

Servo neckX;
Servo neckY;
Servo jaw;
Servo eyesX;
Servo eyesY;
char input[10];
int index = 0;
int value;
int start = 0;
char axis;

void setup() {
  Serial.begin(9600);
  neckX.attach(9);
  neckY.attach(8);
  jaw.attach(10);
  eyesX.attach(11);
  eyesY.attach(12);
  neckX.write(90);
  neckY.write(90);
  jaw.write(65);
  eyesX.write(100);
  eyesY.write(80);
}

void moveServoTo(int angle, char axis) {
  int last_pos;
  int pos;
  float t = (abs(angle) * 0.15 / 60) + 0.1;

  if (pos > 180 || pos < 0)
    return;
  if (axis == 'z') {
    neckX.write(90);
    neckY.write(90);
    jaw.write(65);
  } 
  
  else if (axis == 'x') {
    last_pos = neckX.read();
    pos = last_pos + angle;
    if (pos > 180 || pos < 0)
      return;
    neckX.write(pos);
  }
  
  else if (axis == 'y') {
    last_pos = neckY.read();
    pos = last_pos + angle;
    if (pos > 140 || pos < 20)
      return;
    neckY.write(pos);
  }
   
  else if (axis == 'j') {
    last_pos = jaw.read();
    pos = last_pos + angle;
    if (pos > 130 || pos < 65)
      return;
    jaw.write(pos);
    return;
  } 
  
  else if (axis == 'a') {
    last_pos = eyesX.read();
    pos = last_pos + angle;
    if (pos > 150 || pos < 20)
      return;
    eyesX.write(pos);
  }

  else if (axis == 'b') {
    last_pos = eyesY.read();
    pos = last_pos + angle;
    if (pos > 150 || pos < 20)
      return;
    eyesY.write(pos);
  }

  else if (axis == 'r') {
    eyesY.write(80);
    eyesX.write(100);
  }
  delay(t * 1000);
}

void loop() {
  char c;

  if (Serial.available()) {
    c = Serial.read();
    if (start == 0) {
      axis = c;
      start++;
      return;
    } if (c != '\n') {
      input[index++] = c;
    } else {
      input[index] = 0;
      index = 0;
      start = 0;
      value = atoi(input);
      Serial.println(axis);
      Serial.println(value);
      moveServoTo(value, axis);
    }
  }
}
