import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const role = 'customer';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: retChildren(role),
  },
  {
    path: '',
    redirectTo: '/tabs/beranda',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
function retChildren(role: any): Route[] {
  if (role == 'admin') {
    return [
      {
        path: 'beranda',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'pesanan',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/beranda',
        pathMatch: 'full',
      },
    ];
  } else if (role == 'customer') {
    return [
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
        path: '',
        redirectTo: '/tabs/beranda',
        pathMatch: 'full',
      },
    ];
  } else {
    return [
      {
        path: 'beranda',
        loadChildren: () =>
          import('../tab7/tab7.module').then((m) => m.Tab7PageModule),
      },
      {
        path: 'pesanan',
        loadChildren: () =>
          import('../tab7/tab7.module').then((m) => m.Tab7PageModule),
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('../tab7/tab7.module').then((m) => m.Tab7PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/beranda',
        pathMatch: 'full',
      },
    ];
  }
}
