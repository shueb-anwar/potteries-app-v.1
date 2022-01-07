import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

import { BookingProvider } from './../../providers/firebase/booking';
import { map, filter } from 'lodash';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.component.html',
	styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent {
	public busId: string;
	public bus: any;
	public complexForm: FormGroup;
	public today: any;
	public tomorrow: any;
	public lastmonth: any;
	public items: any;
	public data: any;
	public customAlertOptions: any;

	constructor(
		public fb: FormBuilder,
		public modalController: ModalController,
		navParams: NavParams,
		public bookingProvider: BookingProvider,
	) {

		this.customAlertOptions = {
			cssClass: 'lg',
			// subHeader: 'Select your route',
			message: "You are changing your trip; Please make sure to pick the correct route."
		}

		var today = new Date, tomorrow = new Date(today), lastmonth = new Date(today);

		this.today = this.parseDate(today);

		// lastmonth.setMonth(today.getMonth() - 1);
		lastmonth.setDate(today.getDate() - 7);
		this.lastmonth = this.parseDate(lastmonth);

		tomorrow.setDate(today.getDate() + 1);
		this.tomorrow = this.parseDate(tomorrow);

		this.bus = navParams.get('bus');

		this.complexForm = fb.group({
			date: [this.today, Validators.required],
			route: [this.bus.routeDetail[0].id]
		});

		// this.complexForm.valueChanges.subscribe(val => {
		//   console.log(val);
		// })

		this.complexForm.get('route').valueChanges.subscribe(val => {
			this.filterOnRoute(val);
		});

		this.complexForm.get('date').valueChanges.subscribe(val => {
			this.submitForm(this.parseDate(new Date(val)));
		});

		this.submitForm(this.today);
	}

	parseDate(date) {
		return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join("-");
	}

	submitForm(date) {
		var self = this;

		this.bookingProvider.getBookingHistory(this.bus['key'], date).on("value", function (response) {
			self.items = [];

			map(response.val(), booking => {
				map(booking.passengers, passenger => {
					passenger.route = booking.route;

					self.items.push(passenger)
				})
			});

			self.filterOnRoute(self.complexForm.get('route').value);
		});
	}

	filterOnRoute(route) {
		if (this.items) {
			this.data = filter(this.items, function (item) {
				return item.route == route;
			})
		}
	}

	getItems(event: any) {
		var self = this;

		const val = event.target.value;

		if (val && val.trim() != '') {
			this.data = this.items.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) && item.route == self.complexForm.get('route').value;
			})
		}
	}

	close() {
		this.modalController.dismiss();
	}

}
