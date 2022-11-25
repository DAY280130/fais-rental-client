import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'my-token';
const USER_KEY = 'my-username';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) {
    this.email = '';
    this.password = '';
  }

  ngOnInit() {}

  login() {
    this.api
      .accountGetToken({ email: this.email, password: this.password })
      .subscribe((respond) => {
        if (respond.data.login_status == 'success') {
          this.email = '';
          this.password = '';
          Preferences.set({ key: TOKEN_KEY, value: respond.data.token });
          Preferences.set({
            key: USER_KEY,
            value: respond.data.nama.substr(0, respond.data.nama.indexOf(' ')),
          });
          Preferences.set({ key: 'role', value: respond.data.role });
          location.reload();
        }
      });
  }
}
