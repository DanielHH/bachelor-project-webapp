import { Injectable, NgModule } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
// TODO: is this a service? rename to AuthGuardService?
export class AuthGuardService implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('token')) {
          console.log('canactivate true');
            // TODO: use AuthService.isAuthenticated(),
            // maybe even remove this class and put everything there
            return true;
        }
        // not logged in so redirect to login page
        console.log('canactivate false');
        this.router.navigate(['/login']);
        return false;
    }
}
