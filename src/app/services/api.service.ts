import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { from, Observable } from 'rxjs';
// import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  baseApiUrl(): string {
    return 'http://192.168.1.5:8000/api/';
  }

  // accountGET(params: string) {
  //   return from(
  //     Http.request({
  //       method: 'GET',
  //       url: this.baseApiUrl() + 'accounts' + params,
  //       headers: { 'Content-Type': 'application/json' },
  //     })
  //   );
  // }

  accountGetToken(data: Object): Observable<any> {
    return from(
      Http.request({
        method: 'POST',
        url: this.baseApiUrl() + 'accounts/login',
        headers: { 'Content-Type': 'application/json' },
        data,
      })
    );
  }
}
