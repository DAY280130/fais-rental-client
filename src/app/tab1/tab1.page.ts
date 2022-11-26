import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(private authService: AuthenticationService) {}
  async ngOnInit() {
    await this.loadId();
  }

  async loadId() {
    this.authService.checkToken().then(async () => {
      console.log('tab1', (await Preferences.get({ key: 'id' })).value);
    });
  }
}
