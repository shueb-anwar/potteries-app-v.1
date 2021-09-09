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
  		this.auth.signInWithPhoneNumber(`+91${this.complexForm.controls['mobile'].value}`, (<any>window).recaptchaVerifier)
	    	.then(async (confirmationResult) => {
	        	const modal = await this.modalCtrl.create({
		        	component: OtpComponent,
		        	componentProps: {
		        		mobile: this.complexForm.controls['mobile'].value,
		        		confirmationResult: confirmationResult
		        	}
		        });

		        modal.present();
	    	})
	    	.catch( (error) => {
	    		console.log(error);   // Error; SMS not sent
          if(error.code == 'auth/too-many-requests') {
            this.alertCtrl.create({
              header: 'Opps! Too many requests',
              message: error.message,
              buttons: [
                {
                  text: 'Close',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
            }).then(alert => alert.present())
          } else {
            this.alertCtrl.create({
              header: 'Something Wents Wrong',
              message: 'We are facing logging in by phone number. Would you like to continue login by way',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Continue with Google',
                  handler: () => {
                    this.signInWithGoogle();
                  }
                },
                {
                  text: 'Continue with facebook',
                  handler: () => {
                    this.signInWithFacebook();
                  }
                }
              ]
            }).then(alert => alert.present())
          }
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
      this.auth.signInAnonymously().then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error)
        });
    }

    signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      this.signInWithPopup(provider);
    }

    signInWithFacebook() {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('user_birthday');

      this.signInWithPopup(provider);
    }

    signInWithPopup(provider) {
      var self = this;

      this.auth.signInWithPopup(provider).then(function(result) {
        var user = result.user;
        console.log(user);
        self.router.navigate(['search-bus'], {});
      }).catch(function(error) {
        console.log(error);
      });
    }

}
