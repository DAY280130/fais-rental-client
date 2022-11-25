import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
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
    return this.authService.isAuthenticated.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated: any) => {
        if (isAuthenticated === true) {
          return true;
        } else {
          this.router.navigateByUrl('/');
          console.log('belum login');
          return false;
        }
      })
    );
  }
}
