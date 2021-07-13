import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { ModalController, ToastController } from '@ionic/angular';

import { BusProvider } from './../../providers/firebase/bus';
import firebase from 'firebase/app';

@Component({
  selector: 'app-register-bus',
  templateUrl: '../update-bus/update-bus.component.html',
  styleUrls: ['./register-bus.component.scss'],
})
export class RegisterBusComponent {
	public complexForm : FormGroup;
	public isExpanded: string;
	public data = {
	    name: 'john'
	};

	public page: string = 'register';

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
			lat: [null],
			long: [null],
			contact: ["9560834202", Validators.compose([Validators.required, Validators.maxLength(20)])],
			fare: [null, Validators.compose([Validators.required])],
			capacity: [null, Validators.compose([Validators.required])],
			routeDetail: fb.array([])
		});
	}

	addRoute(route?:any) {
		const routes = <FormArray>this.complexForm.controls['routeDetail'];

		routes.push(
			this.fb.group({
				id: [Math.floor(1000 + Math.random() * 9000)],
				from: [null , Validators.required],
				to: [null, Validators.required],
				// time: ["00:00", Validators.required],
				stopDetail: this.fb.array([])
			})
		);
	}

	removeRoute(i: number) {
		const control = <FormArray>this.complexForm.controls['routeDetail'];

		control.removeAt(i);
	}

	getStop(index: number): FormArray {
		var routeDetail = this.complexForm.get('routeDetail') as FormArray;

		return routeDetail
      .at(index)
      .get('stopDetail') as FormArray;
  }

	addStop(index) {
		this.getStop(index).push(
			this.fb.group({
				location: [null, Validators.required],
				time: ["00:00", Validators.required],
			})
		)
	}

	removeStop(index, stopIndex) {
		this.getStop(index).removeAt(stopIndex);
	}

	dismiss(data) {
		this.modalCtrl.dismiss(data);
	}

	setExpanded(a, b) {
		this.isExpanded = `${a}_${b}`
	}

	getExpanded(a, b) {
		return this.isExpanded == `${a}_${b}`
	}

	submitForm(form) {
		if(form.valid) {
			this.busProvider.addItem(form.value).then((res) => {
				this.complexForm.reset();
				this.presentToast("Bus Registered Successfully");
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
