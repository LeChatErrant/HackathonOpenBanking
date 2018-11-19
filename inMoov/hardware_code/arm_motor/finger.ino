#include <Servo.h>

Servo thumb;
Servo index;
Servo middle;
Servo ring;
Servo pinky;
char input[10];
int i = 0;
int value;
int start = 0;
char axis;

void setup() {
  Serial.begin(9600);
  thumb.attach(3);
  thumb.write(0);
  index.attach(4);
  index.write(0);
  middle.attach(5);
  middle.write(0);
}

void move_hand(int angle, char finger) {
  float t = (abs(angle) * 0.15 / 60) + 0.1;
  Servo toMove;

  if (finger == 't') {
    toMove = thumb;
  } else if (finger == 'i') {
    toMove = index;
  } else if (finger == 'm') {
    toMove = middle;
  } else if (finger == 'r') {
    toMove = ring;
  } else if (finger == 'p') {
    toMove = pinky;
  } else {
    return;
  }
  if (angle > 180 || angle < 0) {
    return;
  }
  toMove.write(angle);
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
      input[i++] = c;
    } else {
      input[i] = 0;
      i = 0;
      start = 0;
      value = atoi(input);
      Serial.println(axis);
      Serial.println(value);
      if (axis == 't' || axis == 'i' || axis == 'm' ||
          axis == 'r' || axis == 'p') {
        move_hand(value, axis);
      }
    }
  }
}