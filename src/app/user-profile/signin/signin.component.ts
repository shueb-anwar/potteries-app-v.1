import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import firebase from 'firebase/app';

import { OtpComponent } from '../otp/otp.component';

interface Window {
    x: any;
    recaptchaVerifier: any;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [AngularFireAuth],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {
	public complexForm : FormGroup;

  constructor(
    public fb: FormBuilder,
    public auth: AngularFireAuth,
    public modalCtrl: ModalController,
    public toastController: ToastController,
    private alertCtrl: AlertController,
    public router: Router,
  ) {
  	this.complexForm = fb.group({
      mobile: [null, Validators.compose([Validators.required, Validators.pattern('[6-9]\\d{9}')])]
    })

    firebase.auth().languageCode = 'en';
  }

  ngOnInit() {}

  ngAfterViewInit() {
    (<any>window).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': function() {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });

    // recaptchaVerifier.render().then(function(widgetId) {
    //   window.recaptchaWidgetId = widgetId;
    // });
  }

  submitForm() {
  	if(this.complexForm.valid) {
  		var self = this;

  		this.auth.signInWithPhoneNumber(`+91${this.complexForm.controls['mobile'].value}`, (<any>window).recaptchaVerifier)
	    	.then(async function (confirmationResult) {
	        	
	        	const modal = await self.modalCtrl.create({
		        	component: OtpComponent,
		        	componentProps: {
		        		mobile: self.complexForm.controls['mobile'].value,
		        		confirmationResult: confirmationResult
		        	}
		        });

		        modal.present();
	    	})
	    	.catch(function (error) {
	    		console.log(error);   // Error; SMS not sent
          // self.presentToast(error.message);

          self.alertCtrl.create({
            header: 'Something Wents Wrong',
            message: 'We are facing logging in by phone number. Would you like to login by Facebook',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Continue with facebook',
                handler: () => {
                  self.signInWithFacebook();
                }
              }
            ]
          }).then(alert => alert.present())
	    	}); 
	    }
    }  

    async presentToast(msg) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 5000
      });

      toast.present();
    }

    signInGuest() {
      this.auth.signInAnonymously()
        .then(function(result) {
          console.log(result);
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }

    signInWithFacebook() {
      var self = this, provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('user_birthday');
      
      provider.setCustomParameters({
        'display': 'popup'
      });

      this.auth.signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        self.router.navigate(['search-bus'], {});
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
    }

}
