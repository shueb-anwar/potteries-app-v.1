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
	    });
  	}

  	ngOnInit() {}

	getData(formData: any) {
		this.busProvider.getItems().then( res => {
			this.buses = filter(res, function(item, index) {
				var route = find(item.routeDetail, function(item: any){
					if(item.to.toLowerCase().includes(formData.to.toLowerCase()) && item.from.toLowerCase().includes(formData.from.toLowerCase())) {
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
