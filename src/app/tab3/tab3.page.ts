import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { LocalFile, ImageService } from '../services/image.service';

const IMAGE_DIR = 'profile';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  token: any;
  id: string | null = '';
  nama: string | null = '';
  oldNama: string | null = this.nama;
  email: string | null = '';
  role: string | null = '';
  profile: string = '';
  oldProfile: string = '';
  disabledInput: boolean = true;
  image: LocalFile = { name: '', path: '', data: '' };

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private alertController: AlertController,
    private router: Router,
    private imgServ: ImageService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadUserData();
    await this.authService.checkToken();
    this.id = (await Preferences.get({ key: 'id' })).value;
    this.image = await this.imgServ.loadLocalImage(
      IMAGE_DIR,
      this.image,
      this.loadingCtrl
    );
    console.log(this.image);

    this.api
      .accountGetDetails((await Preferences.get({ key: 'id' })).value || '')
      .subscribe((respond) => {
        // console.log(respond);

        if (respond.data.get_status === 'success') {
          this.nama = respond.data.nama;
          this.oldNama = respond.data.nama;
          this.email = respond.data.email;
          this.role = respond.data.role;
          this.profile = respond.data.profile;
          this.oldProfile = respond.data.profile;
          // console.log(this.profile);
          if (this.profile != '') {
            this.image.data = `${this.api.baseApiUrl()}accounts/image/${
              this.profile
            }`;
            this.image.name = this.profile;
            console.log('image data : ', this.image.data);
          }
        } else if (respond.data.get_status !== 'failed') {
          location.reload();
        }
      });
    // if (!this.id) {
    // }
  }
  async loadUserData() {
    this.token = (await Preferences.get({ key: 'token' })).value;
  }
  logout() {
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              //jika tekan yakin
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
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

  async deleteSelected() {
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
  }

  async editNama() {
    this.disabledInput = false;
  }

  async cancelUpdate() {
    this.disabledInput = true;
    this.nama = this.oldNama;
    if (!this.profile || this.profile != '') {
      this.image.data = `${this.api.baseApiUrl()}accounts/image/${
        this.profile
      }`;
      this.image.name = this.profile;
    } else {
      this.image.data = { name: '', path: '', data: '' };
    }
  }

  async update() {
    if (
      this.nama == this.oldNama &&
      this.image.data ==
        `${this.api.baseApiUrl()}accounts/image/${this.profile}`
    ) {
      console.log('tidak ada yang berubah');

      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'loading images',
    });
    // let msg; // debug
    await loading.present();
    const reqBody = {
      id: this.id,
      nama: `${this.nama == this.oldNama ? this.oldNama : this.nama}`,
      profile: `${this.image.name}`,
    };
    console.log(reqBody);
    let img: Blob;
    if (this.image.name != '') {
      reqBody.profile = this.image.name;
      const respond = await fetch(this.image.data);
      console.log(respond);

      img = await respond.blob();
      console.log(img);
    }
    this.api.accountEdit(reqBody).subscribe((respond) => {
      console.log(respond);
      // msg = respond.data.message; // debug
      if (respond.data.edit_status === 'success') {
        if (img) {
          this.api
            .uploadProfileImage(img, this.image.name)
            .subscribe((respond) => {
              // msg = JSON.stringify(respond); //debug
              console.log(respond);
              console.log('oldprofile : ', this.oldProfile);
            });
        }
        this.api.deleteProfileImage(this.oldProfile).subscribe((respond) => {
          // msg = JSON.stringify(respond); //debug
          console.log(respond);
          loading.dismiss();
        });
        this.alertController
          .create({
            header: 'Notifikasi',
            subHeader: 'Edit profile sukses!',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.deleteSelected();
                  location.reload();
                },
              },
            ],
          })
          .then((res: any) => {
            res.present();
          });
        console.log('edit berhasil');
        // this.deleteSelected();
        // location.reload();
      } else {
        console.log(respond.data.message);
        loading.dismiss();
      }
    });
  }
}
