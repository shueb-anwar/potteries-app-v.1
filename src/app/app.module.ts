import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { FirebaseProvider } from './providers/firebase/firebase';
import { BusProvider } from './providers/firebase/bus';
import { BookingProvider } from './providers/firebase/booking';
import { UserProvider } from './providers/firebase/user';

const firebaseConfig = {
  apiKey: "AIzaSyCn8Hv-B_j5Wvq9ViWsQycRr6gvJeVBxxc",
  authDomain: "tourlin-8ecee.firebaseapp.com",
  databaseURL: "https://tourlin-8ecee.firebaseio.com",
  projectId: "tourlin-8ecee",
  storageBucket: "tourlin-8ecee.appspot.com",
  messagingSenderId: "103808483283"
};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseProvider,
    BusProvider,
    BookingProvider,
    UserProvider,
    CallNumber,
    Geolocation,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
