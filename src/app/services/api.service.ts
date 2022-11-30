import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  baseApiUrl(): string {
    return 'http://192.168.1.5:8000/api/';
  }

  accountLogin(data: Object): Observable<any> {
    return from(
      Http.request({
        method: 'POST',
        url: this.baseApiUrl() + 'accounts/login',
        headers: { 'Content-Type': 'application/json' },
        data,
      })
    );
  }

  accountCheckToken(data: Object): Observable<any> {
    return from(
      Http.request({
        method: 'POST',
        url: this.baseApiUrl() + 'accounts/token',
        headers: { 'Content-Type': 'application/json' },
        data,
      })
    );
  }

  accountRegister(data: Object): Observable<any> {
    return from(
      Http.request({
        method: 'POST',
        url: this.baseApiUrl() + 'accounts/register',
        headers: { 'Content-Type': 'application/json' },
        data,
      })
    );
  }

  accountGetDetails(id: string) {
    return from(
      Http.request({
        method: 'GET',
        url: this.baseApiUrl() + 'accounts/details/' + id,
      })
    );
  }

  accountEdit(data: Object): Observable<any> {
    return from(
      Http.request({
        method: 'PUT',
        url: this.baseApiUrl() + 'accounts/edit',
        headers: { 'Content-Type': 'application/json' },
        data,
      })
    );
  }

  accountRemove(id: string) {
    return from(
      Http.request({
        method: 'DELETE',
        url: this.baseApiUrl() + 'accounts/remove',
        headers: { 'Content-Type': 'application/json' },
        data: {
          id,
        },
      })
    );
  }

  carGetAll() {
    return from(
      Http.request({
        method: 'GET',
        url: this.baseApiUrl() + 'cars/getall',
      })
    );
  }

  carGet(id: string) {
    return from(
      Http.request({
        method: 'GET',
        url: this.baseApiUrl() + 'cars/get/' + id,
      })
    );
  }

  orderMake(
    renter_id: string,
    car_id: string,
    duration: number,
    price: number
  ) {
    return from(
      Http.request({
        method: 'POST',
        url: this.baseApiUrl() + 'orders/add/',
        headers: { 'Content-Type': 'application/json' },
        data: {
          renter_id,
          car_id,
          duration,
          price,
        },
      })
    );
  }

  orderGetByRenter(id: string) {
    return from(
      Http.request({
        method: 'GET',
        url: this.baseApiUrl() + 'orders/getall/' + id,
      })
    );
  }

  uploadProfileImage(img: Blob, imageName: string) {
    const formData = new FormData();
    formData.append('profile', img, imageName);
    formData.append('test', 'test-value');
    return this.http.post(this.baseApiUrl() + 'accounts/upload', formData);
  }

  deleteProfileImage(imageName: string) {
    // const formData = new FormData();
    // formData.append('filename', imageName);
    // console.log(formData);
    // return this.http.post(this.baseApiUrl() + 'accounts/delimg', formData);
    return from(
      Http.request({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: this.baseApiUrl() + 'accounts/delimg',
        data: {
          filename: imageName,
        },
      })
    );
  }
}
