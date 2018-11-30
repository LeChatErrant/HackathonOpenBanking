import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  promptEvent: any = null;
  constructor(){
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
    var config = {
      apiKey: "AIzaSyCsbnXi94iY2b2m7EnvVGPM3uyPHVexum8",
      authDomain: "home-by-lechaterrant.firebaseapp.com",
      databaseURL: "https://home-by-lechaterrant.firebaseio.com",
      projectId: "home-by-lechaterrant",
      storageBucket: "home-by-lechaterrant.appspot.com",
      messagingSenderId: "504310237780"
    };
    firebase.initializeApp(config);
    console.log('db initialized!')
  }

  public installPwa(): void {
    console.log("DAAAAB");
    this.promptEvent.prompt();
  }
}
