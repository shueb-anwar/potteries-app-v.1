import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { SMS } from '@ionic-native/sms/ngx';
import { ToastController } from '@ionic/angular';

declare var window: any;

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  providers: [SMS],
  encapsulation: ViewEncapsulation.None
})
export class OtpComponent implements OnInit {
  public encryptedMobile = null;
  public otp = null;

  public error = null;
  public submitted: boolean;

  public timer = null;
  public timerValue = 30;
  public mobile: number;
  public confirmationResult: any;
  
  // @Input() mobile: number;


  constructor(
    private sms: SMS,
    private modalController: ModalController,
    private navParams: NavParams,
    public router: Router,
    public toastController: ToastController
  ) {

  	this.mobile = this.navParams.data['mobile'];
  	this.confirmationResult = this.navParams.data['confirmationResult'];

  	this.encryptedMobile = this.mobile.toString().replace(/.(?=.{4})/g, 'x');

  	var self = this;

    this.timer = window.setInterval(function(argument) {
      self.timerValue = self.timerValue - 1;
      
      if(self.timerValue == 0 && !this.otp){
        window.clearInterval(self.timer);
      }
    }, 1000);

    this.sms.hasPermission().then((res) => {
      if(res){
        if(window.SMS) window.SMS.startWatch(function () {}, function() {});

        document.addEventListener('onSMSArrive', (e) => this.publishOTP(e));        
      }
    }, (error) => {
      console.log(error);
    })
  }

  ngOnInit() {}

  publishOTP(e) {
    var sms = e.data.body;
    
    //if(sms.includes('varification')){
      var otp = sms.replace( /^\D+/g, '');
      this.otp = otp;
    //}
  }


  submit(form){
  	var self = this;

    if(form.valid) {
	    this.confirmationResult.confirm("" + this.otp).then((result) => {
	    	var user = result.user;
        
        if(user.displayName) {
          this.presentToast("Loged in");
          this.router.navigate(['search-bus'], {});
        } else {
          this.presentToast("Please Update name in your profile")
          this.router.navigate(['user-profile'], {});
        }
	    	
        self.modalController.dismiss();
	    }).catch(function (error) {
	    	if(error.code == "auth/invalid-verification-code") {
	    		self.otp = "";
	    		// Alert : Invalid OTP
          self.presentToast("Invalid OTP! Please enter the correct OTP")
	    	}
	    });
    }
  }

  dismiss(otp) {
    this.sms.hasPermission().then((res) => {
      if(res){
        /* Remove Events and stop watching the SMS arrive*/
        document.removeEventListener('onSMSArrive', (e) => {});
        if(window.SMS) window.SMS.stopWatch(function () {}, function() {});
        /* Handler Removed */        
      }
    }, (error) => {
      console.log(error);
    })

    this.modalController.dismiss({
    	otp
    })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000
    });

    toast.present();
  }

}
