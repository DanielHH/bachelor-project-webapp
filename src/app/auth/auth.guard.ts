import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import * as _ from 'lodash';
import { User } from '../datamodels/user';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {

  user: User;

  authServiceSubscriber: any;

  constructor(private authService: AuthService, private router: Router) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const validUserTypes = route.data['validUserTypes'];
    if (this.authService.isAuthenticated() && _.includes(validUserTypes, this.user.userType.id)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();
  }
}
