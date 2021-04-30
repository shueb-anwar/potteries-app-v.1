import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-update-user-email',
  templateUrl: './update-user-email.component.html',
  styleUrls: ['./update-user-email.component.scss'],
})
export class UpdateUserEmailComponent{
	public varified: any;
	public email: any;
	public complexForm : FormGroup;

	constructor(
		public fb: FormBuilder,
		public modalController: ModalController,
		navParams: NavParams
	) {
		// this.varified = navParams.get('varified');
		
		this.complexForm = fb.group({
	      email: [navParams.get('email'), Validators.required]
	    });
	}

	submitForm(form) {
	    this.modalController.dismiss({
	    	'email': form.get('email').value
	    })
	}

	varifyEmail() {
	    this.modalController.dismiss({
	    	'email': 'varifyEmail'
	    })
	}

	close() {
		this.modalController.dismiss();
	}

}
