import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  constructor(private authService: AuthenticationService) {}
  async ngOnInit() {
    await this.loadId();
  }

  async loadId() {
    this.authService.checkToken().then(async () => {
      console.log('tab2', (await Preferences.get({ key: 'id' })).value);
    });
  }
}
