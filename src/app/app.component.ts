import { Component, Inject } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { UserProvider } from './providers/firebase/user'; 
import { IUserProfile } from './user-profile/user-profile.interface';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public role: string = 'user';
  public appPages = [];
  public result: boolean = false;

  public user: { displayName: string; email: string; phoneNumber: string; uid: any } = {
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
    private toastCtrl: ToastController,
    public router: Router,
    public auth: AngularFireAuth,
    public userProvider: UserProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.auth.authState.subscribe(user => {
      if (user) {
        this.isAnonymous = user.isAnonymous;
        this.user = user;
        console.log(user);

        this.userProvider.getItem(user.uid).then((res: { payload: IUserProfile, key: string }) => {
          this.role = res.payload.role;
          
          localStorage.setItem('user', JSON.stringify({
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.displayName,
            phoneNumber: user.phoneNumber,
            role: this.role,
            uid: user.uid,
          }));
          
          this.initializeAppPages();
        });
      } else {
        localStorage.setItem('user', null);
        this.router.navigate(['user-profile/signin'], {});
      }
    });
  }

  initializeAppPages() {
    this.appPages = [
      // { title: 'Home', url: '/home', icon: 'home' },
      { title: 'Search Bus', url: '/search-bus', icon: 'subway', enabled: true },
      { title: 'My Buses', url: '/bus-list', icon: 'list', enabled: (this.role == 'owner' || this.role == 'admin' || this.role == 'driver') },
      { title: 'Manage Users', url: '/manage-users', icon: 'people', enabled: (this.role == 'admin') },
      { title: 'User Profile', url: '/user-profile', icon: 'person', enabled: true },
      { title: 'My Bookings', url: '/user-profile/bookings', icon: 'apps', enabled: true }
    ];
  }
  
  demoFunction() {
    this.toastCtrl.create({
      header: 'Confirm logout',
      message: 'Do you really want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    }).then(alert => alert.present())
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
            this.auth.signOut().then( () => {

            }).catch( () => {})
            // firebase.auth().signOut().then(function() {
            //   // self.nav.setRoot(SignIn);
            // }).catch(function(error) {
            //   // An error happened.
            // });
          }
        }
      ]
    }).then(alert => alert.present())
  }
}
