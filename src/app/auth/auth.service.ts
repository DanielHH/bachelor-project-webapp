import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import decode from 'jwt-decode';
import { HttpService } from '../services/http.service';

import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpService) { }

  public getToken(): string {
    localStorage.setItem('token', 'test-token-123');
    return localStorage.getItem('token');
  }

  /**
   * Check if the current user is authenticated by looking for a non-expired
   * JSON Web Token.
  */
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }

  /**
   * Attempt to log in the user by trading credentials for a JSON Web Token.
   * @param username The username of the user.
   * @param password The password of the user.
   */
  login(username: string, password: string): Promise<boolean> {
    return this.httpService.httpPost('authenticate', { username: username, password: password })
        .then((response: Response) => {
          console.log('login response: ', response);
            // if the response contains a token, the login is seen as successful
            const token = response['token'];
            if (token) {
                // store jwt token in local storage to keep user logged in between page refreshes
                // TODO: stringify call?
                localStorage.setItem('token', token);
                console.log('server returned token ', token);
                return true;
            } else {
                console.log('failed login');
                return false;
            }
        });
}

logout(): void {
    // log user out by removing token
    localStorage.removeItem('token');
    // TODO: redirect to login page
}

}
