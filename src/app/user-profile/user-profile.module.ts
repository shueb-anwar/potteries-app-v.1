import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserProfilePage } from './user-profile.page';
import { OtpComponent } from "./otp/otp.component";
import { SigninComponent } from "./signin/signin.component";
import { UpdateUserEmailComponent } from "./update-user-email/update-user-email.component";
import { UpdateUserNameComponent } from "./update-user-name/update-user-name.component";
import { MyBookingsComponent } from "./my-bookings/my-bookings.component";

import { ApplicationPipesModule } from '../application-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  },
  {
    path: 'otp',
    component: OtpComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'update-user-email',
    component: UpdateUserEmailComponent
  },
  {
    path: 'update-user-name',
    component: UpdateUserNameComponent
  },
  {
    path: 'bookings',
    component: MyBookingsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApplicationPipesModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserProfilePage,
    OtpComponent,
    SigninComponent,
    UpdateUserNameComponent,
    UpdateUserEmailComponent,
    MyBookingsComponent
  ]
})
export class UserProfilePageModule {}
