import { Component, OnInit } from '@angular/core';
import { BookingProvider } from './../../providers/firebase/booking';
import firebase from 'firebase/app';
import { BusDetailComponent } from '../../bus-list/bus-detail/bus-detail.component'
import { map } from 'lodash';
import { ModalController } from '@ionic/angular';
import { BusProvider } from '../../providers/firebase/bus'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent {
	public user: any;
	public bookings: any;
	public result: boolean = false;
	public drawerId = 0;
	
	constructor(
		public busProvider: BusProvider,
		public bookingProvider: BookingProvider,
		public modalCtrl: ModalController,
		public router: Router) {
		var self = this;

		this.user = JSON.parse(localStorage.getItem('user'));

		if(this.user) {
		    this.bookingProvider.getMyBookings(this.user.uid).once("value", (res) => {
		      this.bookings = map(res.val(), item => {
		        return item;
		      });

			  this.result = true;
		    })
		} else {
			this.router.navigate(["/search-bus"])
		}
	}

	getColor(status) {
		var color = "";

		if(status == 'TXN_SUCCESS') {
			color: 'light'
		} else if(status == 'PENDING') {
			color = "warning";
		} else if(status == 'TXN_FAILURE') {
			color = "danger"
		}


		return color
	}

	moreDetail(busId) {
		var busId = busId.split(',')[0], self = this, bus = {};

		this.busProvider.getItem(busId).snapshotChanges().subscribe(function(item) {
			item.map(function (item) {
				bus[item.key] = item.payload.val()
			});

			self.busDetail(bus);
		});
	}

	async busDetail(bus) {
	  const modal = await this.modalCtrl.create({
    	component: BusDetailComponent,
    	componentProps: {
        bus
      }
    });

    await modal.present();
  }

}
