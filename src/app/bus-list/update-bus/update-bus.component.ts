import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

import { ModalController, ToastController, NavParams } from '@ionic/angular';

import { BusProvider } from './../../providers/firebase/bus';


import { RegisterBusComponent } from '../register-bus/register-bus.component';
import { map, assign } from 'lodash';

@Component({
  selector: 'app-update-bus',
  templateUrl: './update-bus.component.html',
  styleUrls: ['./update-bus.component.scss'],
})
export class UpdateBusComponent extends RegisterBusComponent {
  public bus: any;

  constructor(
  	public busProvider: BusProvider,
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    navParams: NavParams
  ) {
    super(busProvider, fb, modalCtrl, toastCtrl);

    this.bus = navParams.get('bus');

    this.complexForm.patchValue(assign({}, this.bus, {lat: null, long: null}));

    var self = this;

    if(this.bus.routeDetail && this.bus.routeDetail.length > 1){
      map(this.bus.routeDetail, function(item, index){
        if(index > 0) {
          self.addRoute(item)
        }
      });        
    }
  } 

  close(data) {
		this.modalCtrl.dismiss(data);
	}

  submitForm(form) {
    const self = this;

    if(form.valid) {
      this.busProvider.updateItem(this.bus.key, form.value)
        .then(function(res){
          self.presentToast("Bus Updated Successfully Successfully");
          self.close({ key: self.bus.key, ...form.value });
        });
    } else {
      this.complexForm.markAsTouched();
      this.presentToast("Not all the fields are filled properly", 5000, 'danger');
    };
  }

}
