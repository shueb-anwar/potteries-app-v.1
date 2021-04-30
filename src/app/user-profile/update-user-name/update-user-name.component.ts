import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';


@Component({
  selector: 'app-update-user-name',
  templateUrl: './update-user-name.component.html',
  styleUrls: ['./update-user-name.component.scss'],
})
export class UpdateUserNameComponent {
	public complexForm : FormGroup;

	constructor(
		public fb: FormBuilder,
		public modalController: ModalController,
		navParams: NavParams
	) {
		this.complexForm = fb.group({
	      name: [navParams.get('name'), Validators.required]
	    });
	}

	submitForm(form) {
	    this.modalController.dismiss({
	    	'name': form.get('name').value
	    })
	}

	close() {
		this.modalController.dismiss();
	}
}
