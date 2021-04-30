//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AngularFireDatabase, FirebaseListObservable } from '@angular/fire/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'lodash';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class BusProvider {

  constructor(public db: AngularFireDatabase) { }
   
  getItem(id) {
    return this.db.list(`/busList/${id}`);
  }

  getItems() {
    return this.db.database.ref('/busList/');
  }

  listItems() {
    return this.db.list('/busList/');
  }

  getBusListOld() {
    return this.db.database.ref('/busList/')
      .orderByChild("updated")
      .limitToFirst(4)
      .startAt(1527071660958)
  }

  getBusListByMobile(mobile) {
    return this.db.database.ref('/busList/')
      .orderByChild("contact")
      .limitToFirst(4)
      .startAt(mobile)
  }

  getBusListByMobileUserId(uid) {
    return this.db.database.ref('/busList/')
      .orderByChild("uid")
      // .limitToFirst(4)
      .equalTo(uid)
  }

  getCurrentBusIndex() {
    var ref = this.db.database.ref('/busList/');

    return new Promise(function(resolve, reject) {
      ref.limitToLast(1).once("value", res => {
        console.log(res.val())
        var data = map(res.val(), function(item) {return item})

        resolve(data[0].id)
      })
    })
  }
 
  addItem(payload) {
    //return this.db.list('/busList/').push(payload);
    var ref = this.db.database.ref();
    var listRef = ref.child('busList');

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        listRef.push(payload)
          .then(resolve, reject);
      }, 1);
    });
  }

  updateItem(busId, payload) {
    var ref = this.db.database.ref();
    var listRef = ref.child('busList/' + busId);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        listRef.update(payload)
          .then(resolve, reject);
      }, 1);
    });
  }

  updateBusCoords(busId, coords) {
    var ref = this.db.database.ref();
    var listRef = ref.child('busList/' + busId);
    
    return new Promise(function (resolve, reject) {
      listRef.child('lat').set(coords.latitude);
      listRef.child('lng').set(coords.longitude)
      // listRef.update(coords)
          .then(resolve, reject);
    });
  }
 
  removeItem(id) {
    this.db.list('/busList/').remove(id);
  }
  
}
