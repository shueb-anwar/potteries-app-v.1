import { Component, OnInit } from '@angular/core';
import { BusProvider } from './../providers/firebase/bus';
import { BookingProvider } from './../providers/firebase/booking';
import { IUserProfile } from '../user-profile/user-profile.interface';

import { AngularFireList } from "@angular/fire/database"; 

import { ModalController } from '@ionic/angular';

import { BusDetailComponent } from './bus-detail/bus-detail.component'
import { UpdateBusComponent } from './update-bus/update-bus.component';
import { BookingsComponent } from './bookings/bookings.component';
import { map, find, assign } from 'lodash';

import firebase from 'firebase/app';

// import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.page.html',
  styleUrls: ['./bus-list.page.scss'],
})
export class BusListPage implements OnInit {
	//buses: AngularFireList<any[]>;
  buses: any[] = [];
  public user: IUserProfile;
  public result:boolean = false;

  constructor(
  	public busProvider: BusProvider,
    public bookingProvider: BookingProvider,
    public modalCtrl: ModalController,
    // private geolocation: Geolocation
  ) { 
    this.user = JSON.parse(localStorage.getItem('user'));

    this.busProvider.getBusList(this.user).once('value', (res) => {
      this.buses = map(res.val(), (item, index) => { return { key: index, ...item } });

      this.result = true;
    })
  }

  ngOnInit() { }

  async busDetail(bus) {
	  const modal = await this.modalCtrl.create({
    	component: BusDetailComponent,
    	componentProps: {
        bus
      }
    });

    await modal.present();
  }

  async editBus(bus) {
	  const modal = await this.modalCtrl.create({
    	component: UpdateBusComponent,
    	componentProps: {
        bus
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      var bus = find(this.buses, {key: data.key})

      assign(bus, data);
    }
  }

  updateLocation(item) {
    // let watch = this.geolocation.watchPosition();
    
    // watch.subscribe((resp) => {
    //   if(resp.coords) {
    //     this.busProvider.updateBusCoords(item.$key, resp.coords).then((res) => {
    //       console.log('Location Updated');
    //     });
    //   } else {
    //     alert("Error while getting location")
    //   }
    // });
    
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   if(resp.coords) {
    //     this.busProvider.updateBusCoords(item.$key, resp.coords).then((res) => {
    //       alert('Location Updated');
    //     });
    //   } else {
    //     alert("Error while getting location")
    //   }
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  async bookingList(bus) {
    let modal = await this.modalCtrl.create({
    	component: BookingsComponent,
    	componentProps: {
        bus: bus
      }
    });
    
    await modal.present();
  }
 
  removeItem(id) {
    this.busProvider.removeItem(id);
  }

}
