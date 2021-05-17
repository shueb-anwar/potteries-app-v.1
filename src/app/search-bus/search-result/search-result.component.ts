import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BusProvider } from './../../providers/firebase/bus';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, find } from 'lodash';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchResultComponent implements OnInit {
	buses: any[] = [];
  	route: any = {};
  	result: boolean = false;

  	constructor(
  		public busProvider: BusProvider,
  		private navParams: ActivatedRoute,
  		private router: Router,
  		private callNumber: CallNumber
  		) {
	   	this.navParams.queryParams.subscribe(params => {
	      this.route = params;
    		this.getData(params);

				// this.getBusResult(params);
	    });
  	}

  	ngOnInit() {}

	getData(formData: any) {
		this.busProvider.getItems().then( res => {
			this.buses = filter(res, (item, index) => {
				var route = find(item.routeDetail, (item: any) => {
					var t1 = find(item.stopDetail, (stop, index) => {
						stop.index = index;
						return stop.location.toLowerCase() == formData.from.toLowerCase();
					}), t2 = find(item.stopDetail, (stop, index) => {
						stop.index = index;
						return stop.location.toLowerCase() == formData.to.toLowerCase();
					});

					if( t1 && t2 && t1.index < t2.index) {
						item.time = t1.time;

						return true;
					}
				});

				if(route) {
					item.selectedRoute = route;
					item.busId = index

					return true;
				}
			});

			this.result = true;
		})
	}

	getBusResult(payload) {
		this.busProvider.getResult().then(res => {
			console.log(res);
		})
	}

	bookBus(bus) {
		this.router.navigate(['search-bus/passengers'], {queryParams: {
			bus: JSON.stringify(bus)
		} });

		// var date = new Date(data.date);
		// var dateFormat = [date.getFullYear(), date.getMonth()+1, date.getDate()].join("/");
	}

	callDriver(phone) {
		this.callNumber.callNumber(phone, true)
			.then(() => console.log('Launched dialer!'))
			.catch(() => console.log('Error launching dialer'));
	}

}
