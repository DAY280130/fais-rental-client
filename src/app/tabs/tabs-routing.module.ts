import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AdminGuard } from '../guards/admin.guard';
import { TabsPage } from './tabs.page';

let routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'admin-beranda',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
        canLoad: [AdminGuard],
      },
      {
        path: 'admin-pesanan',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
        canLoad: [AdminGuard],
      },
      {
        path: 'admin-profil',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
        canLoad: [AdminGuard],
      },
      {
        path: 'beranda',
        loadChildren: () =>
          import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: 'pesanan',
        loadChildren: () =>
          import('../tab5/tab5.module').then((m) => m.Tab5PageModule),
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('../tab6/tab6.module').then((m) => m.Tab6PageModule),
      },
      {
        path: '' || ':id',
        loadChildren: () =>
          import('../tab7/tab7.module').then((m) => m.Tab7PageModule),
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
