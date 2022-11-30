import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  orders: any[] = [];
  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private alertController: AlertController
  ) {}
  async ngOnInit() {
    await this.authService.checkToken();
    this.api.orderGetAll().subscribe((respond) => {
      console.log(respond);
      if (respond.data.read_status === 'success') {
        this.orders = respond.data.orders;
        this.orders.map((order) => {
          this.api.accountGetDetails(order.renter_id).subscribe((respond) => {
            if (respond.data.get_status === 'success') {
              const renter = respond.data;
              order.renter_name = renter.nama;
            } else {
              console.log(respond.data.message);
            }
          });
          this.api.carGet(order.car_id).subscribe((respond) => {
            if (respond.data.read_status === 'success') {
              const car = respond.data.car;
              order.car_name = car.nama;
            } else {
              console.log(respond.data.message);
            }
          });
          order.price_string = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(order.price);
        });
        console.log(this.orders);
      } else {
        console.log(respond.data.read_status);
      }
    });
  }

  confirmOrder(id: string) {
    console.log(id);
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Konfirmasi pesanan ?',
        buttons: [
          { text: 'TIDAK' },
          {
            text: 'YA',
            handler: () => {
              this.api.orderConfirm(id).subscribe((respond) => {
                console.log(respond);
                if (respond.data.update_status === 'success') {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Berhasil mengonfirmasi pesanan',
                      buttons: ['OK'],
                    })
                    .then((res) => res.present());
                  location.reload();
                } else {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Gagal mengonfirmasi pesanan',
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
  }

  rejectOrder(id: string) {
    console.log(id);
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Tolak pesanan ?',
        buttons: [
          { text: 'TIDAK' },
          {
            text: 'YA',
            handler: () => {
              this.api.orderReject(id).subscribe((respond) => {
                console.log(respond);
                if (respond.data.update_status === 'success') {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Berhasil menolak pesanan',
                      buttons: ['OK'],
                    })
                    .then((res) => res.present());
                  location.reload();
                } else {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Gagal menolak pesanan',
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
  }

  finishRent(id: string) {
    console.log(id);
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Selesaikan peminjaman ?',
        buttons: [
          { text: 'TIDAK' },
          {
            text: 'YA',
            handler: () => {
              this.api.orderFinish(id).subscribe((respond) => {
                console.log(respond);
                if (respond.data.update_status === 'success') {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Berhasil menyelesaikan peminjaman',
                      buttons: ['OK'],
                    })
                    .then((res) => res.present());
                  location.reload();
                } else {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Gagal menyelesaikan peminjaman',
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
  }

  reload() {
    location.reload();
  }
}
