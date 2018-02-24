import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import decode from 'jwt-decode';

@Injectable()
export class AuthService {
  public getToken(): string {
    console.log('auth service getting that token');
    localStorage.setItem('token', 'test-token-123');
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }

}
