import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

export interface LocalFile {
  name: string;
  path: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private platform: Platform) {}

  async loadLocalImage(IMAGE_DIR: string, image: LocalFile, loadingCtrl: any) {
    image.name = '';
    image.path = '';
    image.data = '';

    const loading = await loadingCtrl.create({
      message: 'loading image',
    });

    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    })
      .then(
        (result) => {
          // console.log('result : ', result);
          this.loadImageData(image, result.files[0], IMAGE_DIR);
        },
        async (error) => {
          console.log('read local image error : ', error);
          await Filesystem.mkdir({
            directory: Directory.Data,
            path: IMAGE_DIR,
          });
        }
      )
      .then(() => {
        loading.dismiss();
      });
    return image;
  }

  async loadImageData(image: LocalFile, files: any, IMAGE_DIR: string) {
    try {
      const filePath = `${IMAGE_DIR}/${files.name}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,
      });
      image.name = files.name;
      image.path = filePath;
      image.data = `data:image/jpeg;base64,${readFile.data}`;
    } catch (err) {}
  }

  async grabImageSaveLocal(IMAGE_DIR: string) {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    // console.log(image);
    if (image) {
      this.saveImageLocal(IMAGE_DIR, image);
    }
  }

  async saveImageLocal(IMAGE_DIR: string, photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    // console.log(base64Data);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
    // console.log('saved file : ', savedFile);
  }

  async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path || '',
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath || '');
      // console.log(photo.webPath);

      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async deleteLocalImages(image: LocalFile) {
    // console.log(image.path);

    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: image.path,
    });
    // for (let image of images) {
    // }
  }
}
