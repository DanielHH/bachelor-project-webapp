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

  public getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Check if the current user is authenticated by looking for a non-expired
   * JSON Web Token.
   */
  public isAuthenticated(): boolean {
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
  public login(username: string, password: string): Promise<boolean> {
    return (
      this.httpService
        /* TODO: change endpoint from 'testPost' to authentication once it has been set up server-side */
        .httpPost('login', { username: username, password: password })
        .then((res) => {
          // if the response contains a token, the login is seen as successful
          /*const token = response ? response['token'] : null;
        if (token) {
          // store jwt token in local storage to keep user logged in between page refreshes
          // TODO: verify token?
          localStorage.setItem('token', token);
          console.log('server returned token ', token);
          return true;
        } else {
          console.log('failed login');
          return false;
        }*/

          // TODO: replace placeholder lines below with the block above (once server can respond)
          // this._user = res.data;
          this._user = new User();
          this._user.id = 1;
          this.user.next(this._user);
          localStorage.setItem('token', 'faked-jwt');
          return true;
        })
    );
  }
  /**
   * Log the user out by removing its auth-token.
   */
  public logout(): void {
    localStorage.removeItem('token');
    // TODO: send message to backend? (revoke token?)
  }
}
