import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusListPage } from './bus-list.page';

import { BookingsComponent } from './bookings/bookings.component';
import { UpdateBusComponent } from './update-bus/update-bus.component';
import { RegisterBusComponent } from './register-bus/register-bus.component';

const routes: Routes = [
  {
    path: '',
    component: BusListPage
  },
  {
    path: 'bookings',
    component: BookingsComponent
  },
  {
    path: 'update-bus',
    component: UpdateBusComponent
  },
  {
    path: 'register-bus',
    component: RegisterBusComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BusListPage, BookingsComponent, UpdateBusComponent, RegisterBusComponent]
})
export class BusListPageModule {}
