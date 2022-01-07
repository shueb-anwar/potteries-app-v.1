import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  public page: string = 'update';

  constructor(
  	public busProvider: BusProvider,
    public fb: FormBuilder,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    navParams: NavParams
  ) {
    super(busProvider, fb, modalCtrl, toastCtrl);
    this.bus = navParams.get('bus');

    if(this.bus.routeDetail && this.bus.routeDetail.length){
      map(this.bus.routeDetail, (item, index) => {
        this.addRoute();

        map(item.stopDetail, (item) => {
          this.addStop(index);
        });
      });        
    }

    this.complexForm.patchValue(assign({}, this.bus, {lat: null, long: null}));
  }

  submitForm(form) {
    if(form.valid) {
      this.busProvider.updateItem(this.bus.key, form.value)
        .then((res) => {
          this.presentToast("Bus Updated Successfully Successfully");
          this.dismiss({ key: this.bus.key, ...form.value });
        });
    } else {
      this.complexForm.markAsTouched();
      this.presentToast("Not all the fields are filled properly", 5000, 'danger');
    };
  }

}
