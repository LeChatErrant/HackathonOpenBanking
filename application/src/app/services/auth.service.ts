import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { identity } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  static uid: string;

  constructor() { }

  createNewUser(email: string, password: string) {
    return new Promise(
      (resolve,reject)=>{
        firebase.auth().createUserWithEmailAndPassword(email,password).then(
          ()=>{
            resolve();
          },
          (error)=>{
            reject(error);
          }
        )
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          (data: any) => {
            AuthService.uid = data.user.uid;
            console.log(data.user.uid);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    firebase.auth().signOut();
  }
}
