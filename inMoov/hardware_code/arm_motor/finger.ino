#include <Servo.h>

Servo thumb;
Servo index;
Servo middle;
Servo ring;
Servo pinky;
char input[10];
int index = 0;
int value;
int start = 0;
char axis;

void setup() {
	Serial.begin(9600);
	thumb.attach(3);
	thumb.write(90);
	index.attach(4);
	index.write(90);
}

void move_hand(char finger, int angle) {
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
      input[index++] = c;
    } else {
      input[index] = 0;
      index = 0;
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