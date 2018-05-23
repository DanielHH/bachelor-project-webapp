import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { User } from '../datamodels/user';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {
  constructor(private httpService: HttpService, private router: Router) {}

  _user: User;

  /**
   * A subscriber to the user list
   */
  user: BehaviorSubject<User> = new BehaviorSubject<User>(this._user);

  /**
   * Check authentication status by checking for a current user.
   */
  isAuthenticated(): boolean {
    return this.user.value && this.user.value.id != null;
  }

  /**
   * Attempt to log in the user with the given username and password.
   * @param username The username of the user.
   * @param password The password of the user.
   */
  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.httpService.httpPost('login', { username: username, password: btoa(password) }).then(res => {
        if (res.message === 'success') {
          this._user = res.data;
          this.user.next(this._user);
          this.router.navigate(['/cards']);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Log out by resetting the current user
   */
  logout(): void {
    this._user = new User();
    this.user.next(this._user);
  }
}
