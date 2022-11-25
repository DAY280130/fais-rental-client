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
  isChecked: boolean;
  mode: string;
  constructor() {
    this.beranda = '';
    this.pesanan = '';
    this.profil = '';
    this.isChecked = false;
    this.mode = 'admin';
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

  isAdmin(): boolean {
    if (this.role === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  changeMode() {
    if (this.mode === 'admin') {
      this.mode = 'customer';
      this.beranda = 'beranda';
      this.pesanan = 'pesanan';
      this.profil = 'profil';
    } else {
      this.mode = 'admin';
      this.beranda = 'admin-beranda';
      this.pesanan = 'admin-pesanan';
      this.profil = 'admin-profil';
    }
  }
}
