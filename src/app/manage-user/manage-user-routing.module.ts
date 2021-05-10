import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageUser } from './manage-user';

const routes: Routes = [
  {
    path: '',
    component: ManageUser
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageUserRoutingModule {}
