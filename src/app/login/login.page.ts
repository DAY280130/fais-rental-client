import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  constructor(
    private api: ApiService,
    private alertController: AlertController
  ) {
    this.email = '';
    this.password = '';
  }

  ngOnInit() {}

  async login() {
    this.api
      .accountLogin({ email: this.email, password: this.password })
      .subscribe(async (respond) => {
        if (respond.data.login_status == 'success') {
          this.email = '';
          this.password = '';
          await Preferences.set({ key: 'token', value: respond.data.token });
          await Preferences.set({ key: 'user', value: respond.data.nama });
          await Preferences.set({ key: 'role', value: respond.data.role });
          this.alertController
            .create({
              header: 'Notifikasi',
              subHeader: 'Login sukses',
              buttons: ['OK'],
            })
            .then((res) => res.present());
          location.reload();
        } else {
          this.alertController
            .create({
              header: 'Notifikasi',
              subHeader: `${respond.data.message}`,
              buttons: ['OK'],
            })
            .then((res) => res.present());
        }
      });
  }
}
