import { Component } from '@angular/core';

import { NavParams, ModalController } from '@ionic/angular';

import { BusProvider } from './../../providers/firebase/bus';

@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrls: ['./bus-detail.component.scss'],
})
export class BusDetailComponent {
	public bus: {};

  constructor(
  	public busProvider: BusProvider,
  	public modalController: ModalController,
  	navParams: NavParams,
  ) {
  	this.bus = navParams.get('bus');
  }

	close() {
		this.modalController.dismiss();
	}

}
