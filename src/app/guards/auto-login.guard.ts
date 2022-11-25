import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  canLoad(): Observable<boolean> {
    console.log('login checking');
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated: any) => {
        // console.log('autoLogin : ' + isAuthenticated);
        if (isAuthenticated === true) {
          console.log('sudah login');
          this.router.navigateByUrl('/app/', { replaceUrl: true });
          return true;
        } else {
          console.log('belum login');
          return true;
        }
      })
    );
  }
}
