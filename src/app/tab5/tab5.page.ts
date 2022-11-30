import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  user_id: string | null = '';
  orders: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.authService.checkToken().then(async () => {
      this.user_id = (await Preferences.get({ key: 'id' })).value;
      this.api.orderGetByRenter(this.user_id || '').subscribe((respond) => {
        console.log(respond);
        if (respond.data.read_status === 'success') {
          this.orders = respond.data.orders;
          this.orders.map(async (order, i) => {
            this.api.carGet(order.car_id).subscribe((respond) => {
              console.log('order' + i + ' : ', respond);
              if (respond.data.read_status == 'success') {
                const car = respond.data.car;
                order.car_name = car.nama;
              } else {
                order.car_name = '';
              }
            });
            order.price_string = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(order.price);
            if (order.status === 'processing') {
              order.status_string = 'Menunggu Konfirmasi';
            }
            if (order.status === 'confirmed') {
              order.status_string = 'Dikonfirmasi';
            }
            if (order.status === 'done') {
              order.status_string = 'Selesai';
            }
            if (order.status === 'rejected') {
              order.status_string = 'Ditolak';
            }
          });
          console.log(this.orders);
        } else {
          console.log(respond.data.read_status);
        }
      });
    });
  }
}
