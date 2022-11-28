import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  assignedRole: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private token: string = '';
  private role: string = '';
  private id: any;

  constructor(private api: ApiService, private imgServ: ImageService) {
    this.authenticateUser();
  }

  async authenticateUser() {
    const token = await Preferences.get({ key: 'token' });
    const role = await Preferences.get({ key: 'role' });
    // console.log(token);

    if (token && token.value && role && role.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      this.role = role.value;
      // console.log(this.token, this.role);

      this.isAuthenticated.next(true);
      this.assignedRole.next(this.role);
      // console.log('authServ : ', this.isAuthenticated);
    } else {
      this.assignedRole.next('');
      this.isAuthenticated.next(false);
    }
  }

  async checkToken() {
    let id;
    const data = {
      token: (await Preferences.get({ key: 'token' })).value,
      user: (await Preferences.get({ key: 'user' })).value,
      role: (await Preferences.get({ key: 'role' })).value,
    };
    this.api.accountCheckToken(data).subscribe(async (respond) => {
      // console.log(respond);

      if (respond.data.message !== 'Token verified') {
        this.logout();
        location.reload();
      } else {
        // console.log(respond);
        this.id = respond.data.id;
        await Preferences.set({ key: 'id', value: this.id });
      }
    });
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.clear();
  }
}
