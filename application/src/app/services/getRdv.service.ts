import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class GetRdvService{

  public db: AngularFireDatabase;

  getDB(table: string) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(table).once('value').then(function(snapshot) {
        const db = snapshot.val();
        resolve(db);
      });
    });
  }

  updateDb = (table: string, data: any) => {
    let ref = firebase.database().ref().child(table);
    ref.update(data);
  };

}