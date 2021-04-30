import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ModalController, ToastController } from '@ionic/angular';

import { BusProvider } from './../../providers/firebase/bus';
import firebase from 'firebase/app';

@Component({
  selector: 'app-register-bus',
  templateUrl: './register-bus.component.html',
  styleUrls: ['./register-bus.component.scss'],
})
export class RegisterBusComponent {
	public complexForm : FormGroup;
	public data = {
	    name: 'john'
	};

	constructor(
		public busProvider: BusProvider,
	    public fb: FormBuilder,
	    public modalCtrl: ModalController,
	    public toastCtrl: ToastController
	) {
		this.complexForm = fb.group({
			name: ["John Deo", Validators.required],
			uid: [firebase.auth().currentUser.uid, Validators.required],
			registration: ["UP 23 T d1234", Validators.compose([Validators.required, Validators.maxLength(20)])],
			to: ["Okhla", Validators.compose([Validators.required, Validators.maxLength(20)])],
			from: ["Amroha", Validators.compose([Validators.required, Validators.maxLength(20)])],
			lat: [null],
			long: [null],
			contact: ["9560834202", Validators.compose([Validators.required, Validators.maxLength(20)])],
			fare: [null, Validators.compose([Validators.required])],
			capacity: [null, Validators.compose([Validators.required])],
			routeDetail: fb.array([
				this.initRoute(),
			])
		})
	}

	initRoute(item?: any){
	    let controlGroup = null;

	    if(item) {
	    	controlGroup = this.fb.group({
		        id: [item.id],
		        from: [item.from, Validators.required],
		        to: [item.to, Validators.required],
		        time: [item.time, Validators.required],
		    });
	    } else {
	    	controlGroup = this.fb.group({
		        id: [Math.floor(1000 + Math.random() * 9000)],
		        from: [null , Validators.required],
		        to: [null, Validators.required],
		        time: ["00:00", Validators.required],
	      	});
	    }

	    return controlGroup;
	}

	addRoute(route?:any) {
		const routes = <FormArray>this.complexForm.controls['routeDetail'];
		routes.push(this.initRoute(route));
	}

	removeRoute(i: number) {
		const control = <FormArray>this.complexForm.controls['routeDetail'];

		control.removeAt(i);
	}

	dismiss() {
		this.modalCtrl.dismiss();
	}

	submitForm(form) {
		const self = this;

		if(form.valid) {
			this.busProvider.addItem(form.value).then(function(res){
				self.complexForm.reset();
				self.presentToast("Bus Registered Successfully");
			});
	    } else {
	    	this.presentToast("Not all the fields are filled properly", 5000, 'danger');
	    };
	}

	async presentToast(msg, duration:number = 5000, color: string = 'primary') {
		const toast = await this.toastCtrl.create({
	      message: msg,
	      duration: duration,
	      color: color
	    });

	    toast.present();
	}

}
