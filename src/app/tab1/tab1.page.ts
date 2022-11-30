import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  cars: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) {}
  async ngOnInit() {
    await this.authService.checkToken();
    this.api.carGetAll().subscribe((respond) => {
      console.log(respond);
      if (respond.data.read_status === 'success') {
        this.cars = respond.data.cars;
        this.cars.map((car, index) => {
          car.price_string = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(car.price);
          car.index = index;
        });
        console.log(this.cars);
      }
    });
  }

  openAddCarModal() {}

  addCar() {}

  openEditCarModal(id: string) {
    console.log(id);
  }

  editCar() {}

  cancelModal() {}

  deleteCar(id: string) {
    console.log(id);
  }

  baseImgUrl(): string {
    return this.api.baseApiUrl() + 'cars/image/';
  }

  reload() {
    location.reload();
  }
}
