import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import * as _ from 'lodash';
import { User } from '../datamodels/user';

@Injectable()
export class AuthGuard implements CanActivate {

  user: User;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user.subscribe(user => (this.user = user));
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
}
