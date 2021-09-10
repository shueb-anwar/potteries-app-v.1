import { Component, Inject } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';

import { UserProvider } from './providers/firebase/user'; 
import { IUserProfile } from './user-profile/user-profile.interface';
import { first } from 'rxjs/operators';
import firebase from 'firebase/app';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public role: string = 'user';
  public appPages = [];
  public result: boolean = false;

  public currentUser: { displayName: string; email: string; phoneNumber: string; uid: any } = {
    displayName: null,
    email: null,
    phoneNumber: null,
    uid: null
  };

  public isAnonymous: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public router: Router,
    public auth: AngularFireAuth,
    public userProvider: UserProvider
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if(this.router.url == '/search-bus') {
        this.alertCtrl.create({
          header: 'Confirm Exit',
          message: 'Do you really want to exit App?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                App.exitApp();
              }
            }
          ]
        }).then(alert => alert.present());
      } else {
        this.router.navigate(['search-bus']);
      }
    });

    this.initializeApp();
  }

  isLoggedIn() {
    return this.auth.authState.pipe(first()).toPromise();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      SplashScreen.hide();
    });

    this.auth.authState.subscribe(currentUser => {
      if (currentUser) {
        this.currentUser = currentUser;
        
        if(!currentUser.displayName) {
          this.demoFunction();
          this.router.navigate(['user-profile'], {});
        }

        this.userProvider.getItem(currentUser.uid).then((user: IUserProfile) => {
          if(user && user.role) this.role = user.role;
        
          localStorage.setItem('user', JSON.stringify({
            email: currentUser.email,
            emailVerified: currentUser.emailVerified,
            name: currentUser.displayName,
            phoneNumber: currentUser.phoneNumber,
            role: this.role,
            uid: currentUser.uid,
          }));

          if(!currentUser.displayName) {
            this.demoFunction();
            
            this.router.navigate(['user-profile'], {});
          }
          
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
      header: 'Important',
      message: 'Please update your name',
      buttons: [
        {
          text: 'Ok',
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
