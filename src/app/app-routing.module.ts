import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search-bus',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'manage-users',
    loadChildren: () => import('./manage-user/manage-user.module').then( m => m.ManageUserModule),
    data: {
      title: 'Manage Users'
    }
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { 
    path: 'search-bus',
    loadChildren: () => import('./search-bus/search-bus.module').then( m => m.SearchBusPageModule)
  },
  {
    path: 'bus-list',
    loadChildren: () => import('./bus-list/bus-list.module').then( m => m.BusListPageModule)
  },
  { 
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
