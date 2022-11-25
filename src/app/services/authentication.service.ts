import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  assignedRole: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  token: string = '';
  role: string = '';

  constructor() {
    this.loadUserData();
  }

  async loadUserData() {
    const token = await Preferences.get({ key: 'token' });
    const role = await Preferences.get({ key: 'role' });
    // console.log(token);

    if (token && token.value && role && role.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      this.role = role.value;
      console.log(this.token, this.role);

      this.isAuthenticated.next(true);
      this.assignedRole.next(this.role);
      console.log('authServ : ', this.isAuthenticated);
    } else {
      this.assignedRole.next('');
      this.isAuthenticated.next(false);
    }
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.clear();
  }
}
