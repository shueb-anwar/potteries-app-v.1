import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import * as firebase from 'firebase/app';

import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UpdateUserNameComponent } from './update-user-name/update-user-name.component';
import { UpdateUserEmailComponent } from './update-user-email/update-user-email.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserProvider } from '../providers/firebase/user'; 
import { UserService } from '../user.service';
import { IUserProfile } from './user-profile.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
	public user: any;
  public profileData: any;

	public editName: boolean = false;
	public editEmail: boolean = false;
	public complexForm : FormGroup;

  	constructor(
	    public fb: FormBuilder,
	    private toastCtrl: AlertController,
	    public modalCtrl: ModalController,
      public router: Router,
      public auth: AngularFireAuth,
      public userProvider: UserProvider,
      public userService: UserService
	) {
    var self = this;

    this.getCurrentUser(this.auth).then(function(user) {
      self.user = user;

      self.fetchUserProfileData();
    })

    this.complexForm = fb.group({
      gender: [null, Validators.required]
    });

    this.complexForm.get('gender').valueChanges.subscribe(gender => {
      this.updateUserProfileData({ gender })
    });
  }

  fetchUserProfileData() {
    var self = this;

    this.userProvider.getItem(this.user.uid).then(function (res: {payload: IUserProfile, key: string}) {
      if(res && res.payload) {
        self.complexForm.patchValue(res.payload)
      }
    });
  }

  updateUserProfileData(payload) {
    var self = this;

    this.userProvider.getItem(self.user.uid).then(function (res: {payload: IUserProfile, key: string}) {
      if(res && res.payload) {
        var data = {...res.payload,  ...payload }
        self.userProvider.updateItem(data, res.key);
      } else {
        self.userProvider.addItem({
          payload,
          uid: self.user.uid
        })
      }
    });
  }

  getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          // unsubscribe();
          resolve(user);
       }, reject);
    });
  }

  async editUserName() {
    var self = this;

    const modal = await this.modalCtrl.create({
      component: UpdateUserNameComponent,
      componentProps: { name: this.user.displayName }
    });

    await modal.present()

    const { data } = await modal.onDidDismiss();

    if(data && data.name) {
      this.user.updateProfile({
        displayName: data.name,
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        self.presentToast("Display Name Updated Successfully!");
        self.editName = false;
      }).catch(function(error) {
        // An error happened.
      });
    }
  }

  async editUserEmail() {
    var self = this;

    const modal = await this.modalCtrl.create({
    	component: UpdateUserEmailComponent,
    	componentProps: {
      		email: this.user.email,
      		varified: (this.user.email && this.user.emailVerified)
    	}
    });

    await modal.present()

    const { data } = await modal.onDidDismiss();

      if(data && data.email == 'varifyEmail') {
        this.user.sendEmailVerification().then(function(res) {
          self.presentToast('Email ID Verification Email sent. Please click on link to verify email')
        });
      } else if(data && data.email) {
        this.user.updateEmail(data.email).then(function() {
          self.presentToast("Email Updated successful")
          self.editEmail = false;
        }).catch(function(error) {
          self.presentToast(error.message)
        });
      }
  }

  async presentToast( msg ) {
    let toast = await this.toastCtrl.create({
      header: 'Message',
      message: msg,
      buttons: ['Close']
    });
    
    toast.present();
  }
}
