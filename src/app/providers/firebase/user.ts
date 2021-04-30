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
export class UserProvider {

  constructor(public afd: AngularFireDatabase) { }
 
  getItem(id) {
    return this.afd.list(`/users/${id}`);
  }

  getItems() {
    return this.afd.list('/users/');
  }
 
  addItem(name) {
    this.afd.list('/users/').push(name);
  }
 
  removeItem(id) {
    this.afd.list('/users/').remove(id);
  }
}
