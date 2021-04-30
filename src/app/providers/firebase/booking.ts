//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AngularFireDatabase, FirebaseListObservable } from '@angular/fire/database';

import { AngularFireDatabase } from '@angular/fire/database';


/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BookingProvider {

  constructor(public db: AngularFireDatabase) { }
   
  getBookingHistory(busId, date) {
    // var ref = this.db.database.ref(`/bookings/${busId}`);

    // return ref.orderByChild("date").equalTo(date);
    //   // ref.orderByChild("busId").equalTo(busId)


    var query = [busId, date].join(',');
    var ref = this.db.database.ref('/bookings');
    
    return ref.orderByChild("index")
      .equalTo(query);
    
  }

  getMyBookings(userid) {
    var ref = this.db.database.ref('/bookings');
    
    return ref.orderByChild("userid")
      .equalTo(userid);
  }
 
  addItem(busId, payload) {
    // var ref = this.db.database.ref();
    // var listRef = ref.child(`/bookings/${busId}`);

    // return new Promise(function (resolve, reject) {
    //   setTimeout(function () {
    //     listRef.push(payload)
    //       .then(resolve, reject);
    //   }, 1);
    // });

    var ref = this.db.database.ref();
    var listRef = ref.child('/bookings');
    
    payload.index = [busId, payload.date].join(',');

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        listRef.push(payload)
          .then(resolve, reject);
      }, 1);
    });
  }

  updateBookingStatus(bookingId, status, orderid) {
    var ref = this.db.database.ref('bookings')
      var listRef = ref.child(bookingId);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        listRef.update({status, orderid})
          .then(resolve, reject);
      }, 1);
    });
  }

  removeItem(bookingId) {
    var ref = this.db.database.ref('bookings/' + bookingId);
    ref.remove();
  }
  
}
