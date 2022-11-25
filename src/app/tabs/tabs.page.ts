import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  beranda: string;
  pesanan: string;
  profil: string;
  role: any;
  constructor() {
    console.log(this.role);

    // this.role = null;
    this.beranda = 'admin/beranda';
    this.pesanan = 'admin/pesanan';
    this.profil = '';
    // this.loadRole();
  }

  ngOnInit() {
    this.loadRole();
  }

  async loadRole() {
    const role = await Preferences.get({ key: 'role' });
    if (role.value !== null) {
      this.role = role.value;
      if (this.role === 'admin') {
        this.beranda = 'admin-beranda';
        this.pesanan = 'admin-pesanan';
        this.profil = 'admin-profil';
      } else {
        this.beranda = 'beranda';
        this.pesanan = 'pesanan';
        this.profil = 'profil';
      }
    }
  }
}
