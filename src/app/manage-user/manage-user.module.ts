import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageUserRoutingModule } from './manage-user-routing.module';

import { ManageUser } from './manage-user';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageUserRoutingModule
  ],
  declarations: [ManageUser]
})
export class ManageUserModule {}
