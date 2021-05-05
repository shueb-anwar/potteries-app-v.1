import { Component, Inject } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    // { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Search Bus', url: '/search-bus', icon: 'subway' },
    { title: 'Manage Buses', url: '/bus-list', icon: 'list' },
    { title: 'User Profile', url: '/user-profile', icon: 'person' },
    { title: 'My Bookings', url: '/user-profile/bookings', icon: 'apps' }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public user: {
    displayName: string;
    email: string;
    phoneNumber: string;
    uid: any;
  } = {
    displayName: null,
    email: null,
    phoneNumber: null,
    uid: null
  };

  public isAnonymous: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    public router: Router,
    public auth: AngularFireAuth
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    var self = this;

    this.auth.onAuthStateChanged(function(user) {
      if (user) {
        self.isAnonymous = user.isAnonymous;
        self.user = user;
        console.log(user)
      } else {
        self.router.navigate(['user-profile/signin'], {});
      }
    });
  }

  logout() {
    this.alertCtrl.create({
      header: 'Confirm logout',
      message: 'Do you really want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            firebase.auth().signOut().then(function() {
              // self.nav.setRoot(SignIn);
            }).catch(function(error) {
              // An error happened.
            });
          }
        }
      ]
    }).then(alert => alert.present())
  }
}
