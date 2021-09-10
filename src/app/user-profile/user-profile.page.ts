import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { UpdateUserNameComponent } from './update-user-name/update-user-name.component';
import { UpdateUserEmailComponent } from './update-user-email/update-user-email.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserProvider } from '../providers/firebase/user'; 
import { UserService } from '../user.service';
import { IUserProfile } from './user-profile.interface';
import { map } from 'lodash';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
	public currentUser: any;
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
    this.getCurrentUser(this.auth).then(currentUser => {
      this.currentUser = currentUser;

      this.fetchUserProfileData();
    })

    this.complexForm = fb.group({
      gender: [null, Validators.required]
    });

    this.complexForm.get('gender').valueChanges.subscribe(gender => {
      this.updateUserProfileData({ gender })
    });
  }

  fetchUserProfileData() {
    this.userProvider.getItem(this.currentUser.uid).then((user: IUserProfile) => {
      if(user && user.gender) {
        this.complexForm.patchValue({gender: user.gender})
      }
    });
  }

  updateUserProfileData(data) {
    this.userProvider.getItem(this.currentUser.uid).then((user: IUserProfile ) => {
      if(user) {
        this.userProvider.updateItem( data , user.key);
      } else {
        this.userProvider.addItem({
          ...data,
          uid: this.currentUser.uid
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
      componentProps: { name: this.currentUser.displayName }
    });

    await modal.present()

    const { data } = await modal.onDidDismiss();

    if(data && data.name) {
      this.currentUser.updateProfile({
        displayName: data.name,
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        self.presentToast("Display Name Updated Successfully!");
        self.editName = false;

        self.updateUserProfileData({name: data.name})
      }).catch(function(error) {
        // An error happened.
      });
    }
  }

  async editUserEmail() {
    const modal = await this.modalCtrl.create({
    	component: UpdateUserEmailComponent,
    	componentProps: {
      		email: this.currentUser.email,
      		varified: (this.currentUser.email && this.currentUser.emailVerified)
    	}
    });

    await modal.present()

    const { data } = await modal.onDidDismiss();

    if(data && data.email == 'varifyEmail') {
      this.currentUser.sendEmailVerification().then((res) => {
        this.presentToast('Email ID Verification Email sent. Please click on link to verify email')
      });
    } else if(data && data.email) {
      this.currentUser.updateEmail(data.email).then(() => {
        this.presentToast("Email Updated successful")
        this.editEmail = false;
      }).catch((error) => {
        this.presentToast(error.message)
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
