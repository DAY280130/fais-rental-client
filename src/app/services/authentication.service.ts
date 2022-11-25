import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  token: string = '';

  constructor() {
    this.loadtoken();
  }

  async loadtoken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    // console.log(token);

    if (token && token.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      console.log(this.token);

      this.isAuthenticated.next(true);
      console.log('authServ : ', this.isAuthenticated);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.clear();
  }
}
