import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
interface car {
  color: string;
  gear: string;
  id: string | null;
  image: string;
  index: number;
  nama: string;
  price: number;
  price_string: string | null;
  seat: number;
  status: string;
  tahun: number;
}
interface orderDetails {
  duration: number;
  total_price: number;
}
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  id: string | null = '';
  cars: any[] = [];
  orderDetails: orderDetails = { duration: 1, total_price: 0 };
  modalCar: car = {
    color: ' ',
    gear: ' ',
    id: ' ',
    image: ' ',
    index: 0,
    nama: ' ',
    price: 0,
    price_string: ' ',
    seat: 0,
    status: ' ',
    tahun: 0,
  };
  isOrderModalOpen = false;
  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.authService.checkToken().then(async () => {
      this.id = (await Preferences.get({ key: 'id' })).value;
    });
    this.api.carGetAll().subscribe((respond) => {
      console.log(respond);
      this.cars = respond.data.cars;
      this.cars.map((car, index) => {
        car.price_string = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(car.price);
        car.index = index;
      });
    });
  }

  async openModal(arrayIndex: number) {
    this.isOrderModalOpen = true;
    this.modalCar = this.cars[arrayIndex];
    console.log(arrayIndex, this.modalCar);
  }

  totalPriceString(): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(this.orderDetails.duration * this.modalCar.price);
  }

  async order() {
    this.id = (await Preferences.get({ key: 'id' })).value;
    this.orderDetails.total_price =
      this.orderDetails.duration * this.modalCar.price;
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Buat Pesanan?',
        buttons: [
          {
            text: 'TIDAK',
          },
          {
            text: 'YA',
            handler: () => {
              this.api
                .orderMake(
                  this.id || '',
                  this.modalCar.id || '',
                  this.orderDetails.duration,
                  this.orderDetails.total_price
                )
                .subscribe((respond) => {
                  console.log(respond);
                  if (respond.data.create_status === 'success') {
                    this.alertController
                      .create({
                        header: 'Notifikasi',
                        subHeader: `${respond.data.message}\nkode order :\n${respond.data.order_id}`,
                        buttons: [
                          {
                            text: 'OK',
                            handler: () => {
                              this.closeModal().then(() => {
                                location.reload();
                              });
                            },
                          },
                        ],
                      })
                      .then((res) => res.present());
                  } else {
                    this.alertController
                      .create({
                        header: 'Notifikasi',
                        subHeader: respond.data.message,
                        buttons: ['OK'],
                      })
                      .then((res) => res.present());
                  }
                });
            },
          },
        ],
      })
      .then((res) => res.present());
    // this.api
    //   .orderMake(
    //     this.id || '',
    //     this.modalCar.id || '',
    //     this.orderDetails.duration,
    //     this.orderDetails.total_price
    //   )
    //   .subscribe((respond) => {});
  }

  async closeModal() {
    this.isOrderModalOpen = false;
  }

  baseImgUrl(): string {
    return this.api.baseApiUrl() + 'cars/image/';
  }

  reload() {
    location.reload();
  }
}
