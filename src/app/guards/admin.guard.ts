import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanLoad {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canLoad(): Observable<boolean> {
    return this.authService.assignedRole.pipe(
      filter((val) => val !== null),
      take(1),
      map((assignedRole) => {
        if (assignedRole === 'admin') {
          return true;
        } else if (assignedRole === 'customer') {
          this.router.navigateByUrl('app/beranda', { replaceUrl: true });
          console.log('anda customer');
          return false;
        } else {
          this.router.navigateByUrl('login');
          console.log('belum login juga');
          return false;
        }
      })
    );
  }
}
