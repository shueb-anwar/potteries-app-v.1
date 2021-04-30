import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchBusPage } from './search-bus.page';
import { SearchResultComponent } from './search-result/search-result.component';
import { PassengersDetailComponent } from './passengers-detail/passengers-detail.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

import { ApplicationPipesModule } from '../application-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SearchBusPage
  },
  {
    path: 'result',
    component: SearchResultComponent
  },
  {
    path: 'passengers',
    component: PassengersDetailComponent
  },
  {
    path: 'confirmation',
    component: BookingConfirmationComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ApplicationPipesModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SearchBusPage, 
    SearchResultComponent, 
    PassengersDetailComponent, 
    BookingConfirmationComponent
  ]
})
export class SearchBusPageModule {}
