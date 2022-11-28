import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;

  constructor(private api: ApiService) {
    this.email = '';
    this.password = '';
  }

  ngOnInit() {}

  login() {
    this.api
      .accountLogin({ email: this.email, password: this.password })
      .subscribe((respond) => {
        if (respond.data.login_status == 'success') {
          this.email = '';
          this.password = '';
          Preferences.set({ key: 'token', value: respond.data.token });
          Preferences.set({ key: 'user', value: respond.data.nama });
          Preferences.set({ key: 'role', value: respond.data.role });
          location.reload();
        }
      });
  }
}
