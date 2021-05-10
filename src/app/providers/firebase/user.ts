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
export class UserProvider {

  constructor(public afd: AngularFireDatabase) { }
 
  getItem(uid) {
    var ref = this.afd.database.ref('/users/');

    return new Promise(function(resolve, reject) {
      ref.orderByChild("uid")
      .equalTo(uid)
      .once('value', function (res) {
        resolve(map(res.val(), function(payload, index) { return { key: index, payload } })[0]);
      })
    });
  }


  updateItem(payload, index) {
    var ref = this.afd.database.ref();
    var listRef = ref.child('users/' + index);
    
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        listRef.update(payload)
          .then(resolve, reject);
      }, 1);
    });
  }

  getItems() {
    var ref =  this.afd.database.ref('/users/')

    return new Promise(function(resolve, reject) {
      ref.orderByChild("uid")
      .once('value', function (res) {
        resolve(map(res.val(), (item, index) => { return { key: index, ...item } }));
      })
    });
  }
 
  addItem(name) {
    this.afd.list('/users/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/users/').remove(id);
  }
}
