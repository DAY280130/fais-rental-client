import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageService, LocalFile } from '../services/image.service';

const IMAGE_DIR = 'car';
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
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  isCarModalOpen: boolean = false;
  cars: any[] = [];
  image: LocalFile = { name: '', path: '', data: '' };
  modalCar: car = {
    color: '',
    gear: 'manual',
    id: '',
    image: '',
    index: 0,
    nama: '',
    price: 100000,
    price_string: '',
    seat: 2,
    status: '',
    tahun: 1990,
  };
  newCar: boolean = true;

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private imgServ: ImageService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
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

  modalAction() {
    if (this.newCar == true) {
      return this.addCar();
    } else {
      return this.editCar();
    }
  }

  openAddCarModal() {
    this.isCarModalOpen = true;
    this.newCar = true;
    this.modalCar = {
      color: '',
      gear: 'manual',
      id: '',
      image: '',
      index: 0,
      nama: '',
      price: 100000,
      price_string: '',
      seat: 2,
      status: '',
      tahun: 1990,
    };
  }

  async selectImage() {
    // if already select image previously
    if (this.image.path != '') {
      await this.imgServ.deleteLocalImages(this.image);
      // this.image = { name: '', path: '', data: '' };
    }
    // grab image and save to local data
    await this.imgServ.grabImageSaveLocal(IMAGE_DIR);
    // load local image
    this.image = await this.imgServ.loadLocalImage(
      IMAGE_DIR,
      this.image,
      this.loadingCtrl
    );
    console.log(this.image);
  }

  async addCar() {
    console.log(this.modalCar);
    const reqBody = {
      nama: this.modalCar.nama,
      tahun: this.modalCar.tahun,
      seat: this.modalCar.seat,
      gear: this.modalCar.gear,
      color: this.modalCar.color,
      price: this.modalCar.price,
      image: `${this.image.name}`,
    };
    console.log(reqBody);
    let img: Blob;

    if (this.image.path != '') {
      const respond = await fetch(this.image.data);
      console.log(respond);

      img = await respond.blob();
      console.log(img);
    }
    this.api.carAdd(reqBody).subscribe((respond) => {
      console.log(respond);
      if (respond.data.create_status === 'success') {
        console.log(img);

        this.api.uploadCarImage(img, reqBody.image).subscribe((respond) => {
          console.log(respond);
        });
        this.alertController
          .create({
            header: 'Notifikasi',
            subHeader: `${respond.data.message}`,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.cancelModal();
                  location.reload();
                },
              },
            ],
          })
          .then((res: any) => {
            res.present();
          });
      } else {
        this.alertController
          .create({
            header: 'Notifikasi',
            subHeader: `${respond.data.message}`,
            buttons: ['OK'],
          })
          .then((res: any) => {
            res.present();
          });
      }
    });
  }

  openEditCarModal(index: number) {
    console.log(index);
    this.isCarModalOpen = true;
    this.newCar = false;
    this.modalCar = this.cars[index];
    this.image.data = this.baseImgUrl() + this.modalCar.image;
  }

  async editCar() {
    console.log(this.modalCar);
    const reqBody = {
      id: this.modalCar.id,
      nama: this.modalCar.nama,
      tahun: this.modalCar.tahun,
      seat: this.modalCar.seat,
      gear: this.modalCar.gear,
      color: this.modalCar.color,
      price: this.modalCar.price,
      image: `${this.image.name ? this.image.name : this.modalCar.image}`,
    };
    console.log(reqBody);
    let img: Blob;
    if (this.image.path != '') {
      const respond = await fetch(this.image.data);
      console.log(respond);

      img = await respond.blob();
      console.log(img);
    }
    this.api.carEdit(reqBody).subscribe((respond) => {
      console.log(respond);
      if (respond.data.update_status === 'success') {
        console.log(img);
        if (img) {
          this.api.uploadCarImage(img, this.image.name).subscribe((res) => {
            // msg = JSON.stringify(respond); //debug
            console.log(res);
          });
          this.api.deleteCarImage(this.modalCar.image).subscribe((respond) => {
            // msg = JSON.stringify(respond); //debug
            console.log(respond);
          });
        }
        this.alertController
          .create({
            header: 'Notifikasi',
            subHeader: 'Edit mobil sukses!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.cancelModal();
                  location.reload();
                },
              },
            ],
          })
          .then((res: any) => {
            res.present();
          });
      } else {
        this.alertController
          .create({
            header: 'Notifikasi',
            subHeader: 'Edit mobil gagal!',
            buttons: ['OK'],
          })
          .then((res: any) => {
            res.present();
          });
      }
    });
  }

  async cancelModal() {
    try {
      await this.imgServ.deleteLocalImages(this.image);
      this.image = await this.imgServ.loadLocalImage(
        IMAGE_DIR,
        this.image,
        this.loadingCtrl
      );
    } catch (err) {
      console.log(err);
    }
    this.image = { name: '', path: '', data: '' };
    this.isCarModalOpen = false;
  }

  async deleteCar(index: number) {
    const car = this.cars[index];
    console.log(car.id);
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Ingin Hapus mobil?',
        buttons: [
          {
            text: 'TIDAK',
          },
          {
            text: 'YA',
            handler: () => {
              this.api.carDelete(car.id).subscribe((respond) => {
                console.log(respond);
                if (respond.data.delete_status === 'success') {
                  this.api.deleteCarImage(car.image).subscribe((res) => {
                    console.log(res);
                  });
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Hapus mobil sukses!',
                      buttons: [
                        {
                          text: 'OK',
                          handler: () => {
                            location.reload();
                          },
                        },
                      ],
                    })
                    .then((res: any) => {
                      res.present();
                    });
                } else {
                  this.alertController
                    .create({
                      header: 'Notifikasi',
                      subHeader: 'Hapus mobil gagal!',
                      buttons: ['OK'],
                    })
                    .then((res: any) => {
                      res.present();
                    });
                }
              });
            },
          },
        ],
      })
      .then((res) => res.present());
  }

  baseImgUrl(): string {
    return this.api.baseApiUrl() + 'cars/image/';
  }

  reload() {
    location.reload();
  }
}
