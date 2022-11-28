import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { LocalFile, ImageService } from '../services/image.service';

const IMAGE_DIR = 'register';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nama: string | null;
  email: string | null;
  password: string | null;
  preview: string;
  image: LocalFile = { name: '', path: '', data: '' };
  // imageRes: any;
  constructor(
    private imgServ: ImageService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private api: ApiService,
    private router: Router
  ) {
    this.nama = null;
    this.email = null;
    this.password = null;
    this.preview = 'assets/images/profile/placeholder.jpg';
  }

  async ngOnInit() {
    this.image = await this.imgServ.loadLocalImage(
      IMAGE_DIR,
      this.image,
      this.loadingCtrl
    );
    console.log(this.image);
  }

  async selectImage() {
    // if already select image previously
    if (this.image.data != '') {
      await this.imgServ.deleteLocalImages(this.image);
    }
    // grab image and save to local data
    await this.imgServ.grabImageSaveLocal(IMAGE_DIR);
    // load local image
    this.image = await this.imgServ.loadLocalImage(
      IMAGE_DIR,
      this.image,
      this.loadingCtrl
    );
  }

  async deleteSelected() {
    await this.imgServ.deleteLocalImages(this.image);
    this.image = await this.imgServ.loadLocalImage(
      IMAGE_DIR,
      this.image,
      this.loadingCtrl
    );
  }

  async register() {
    const loading = await this.loadingCtrl.create({
      message: 'loading images',
    });

    await loading.present();
    let img: Blob;
    const reqBody = {
      nama: this.nama,
      email: this.email,
      password: this.password,
      profile: '',
    };
    if (this.image) {
      reqBody.profile = this.image.name;
      const respond = await fetch(this.image.data);
      console.log(respond);

      img = await respond.blob();
      console.log(img);
    }
    console.log(reqBody);
    this.api.accountRegister(reqBody).subscribe((respond) => {
      console.log(respond);
      if (respond.data.register_status === 'success') {
        if (this.image.data != '') {
          this.api
            .uploadProfileImage(img, this.image.name)
            .subscribe((respond) => {
              console.log(respond);
            });
        }
        this.nama = '';
        this.email = '';
        this.password = '';
        this.deleteSelected();
        loading.dismiss();
        this.alertCtrl
          .create({
            header: 'Notifikasi',
            subHeader: 'Buat Akun Sukses!',
            buttons: [
              {
                text: 'OK',
                handler: (data: any) => {
                  this.router.navigateByUrl('/login');
                },
              },
            ],
          })
          .then((res) => {
            res.present();
          });
      } else {
        this.alertCtrl
          .create({
            header: 'Notifikasi',
            subHeader: `${respond.data.message}`,
            buttons: ['OK'],
          })
          .then((res) => {
            res.present();
          });

        loading.dismiss();
      }
    });
  }
}
