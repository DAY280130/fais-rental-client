import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
})
export class Tab6Page implements OnInit {
  token: any;
  user: any;
  role: any;
  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  async loadUserData() {
    this.token = (await Preferences.get({ key: 'token' })).value;
    this.user = (await Preferences.get({ key: 'user' })).value;
    this.role = (await Preferences.get({ key: 'role' })).value;
  }
  logout() {
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              //jika tekan yakin
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }
  async checkToken() {
    await this.authService.checkToken();
  }
}
