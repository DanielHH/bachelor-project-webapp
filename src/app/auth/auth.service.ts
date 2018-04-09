import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { HttpService } from '../services/http.service';

import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../datamodels/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  _user: User;

  /**
   * A subscriber to the user list
   */
  user: BehaviorSubject<User> = new BehaviorSubject<User>(this._user);

  getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Check if the current user is authenticated by looking for a non-expired
   * JSON Web Token.
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    // TODO: test if tokenNotExpired behaves as expected, replace placeholder code
    return token === 'faked-jwt'; // && tokenNotExpired(token);
  }

  /**
   * Attempt to log in the user by trading credentials for a JSON Web Token,
   * which can be used to access protected resources.
   * @param username The username of the user.
   * @param password The password of the user.
   */
  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.httpService.httpPost('login', { username: username, password: btoa(password) }).then(res => {
        if (res.message === 'success') {
          this._user = res.data;
          this.user.next(this._user);

          /**
           * Change to correct token when implemented
           */
          localStorage.setItem('token', 'faked-jwt');
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  /**
   * Log the user out by removing its auth-token.
   */
  logout(): void {
    this._user = new User();
    this.user.next(this._user);
    localStorage.removeItem('token');
    // TODO: send message to backend? (revoke token?)
  }
}
