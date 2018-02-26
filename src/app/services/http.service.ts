import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class HttpService {

  /**
   * API url
   */
  host = 'http://api.nlsn.se/';

  constructor(private http: Http) { }

  /**
   * Get request to given url
   * @param url request url
   */
  httpGet<T>(url: string) {
    return this.http.get(this.host + url).toPromise()
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
  }

  /**
   * Post request to given url
   * @param url request url
   * @param body body containing request data
   */
  httpPost<T>(url: string, body?: any) {
    return this.http.post(this.host + url, body).toPromise()
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
  }

  /**
   * Put request to given url
   * @param url request url
   * @param body body containing request data
   */
  httpPut<T>(url: string, body?: any) {
    return this.http.put(this.host + url, body).toPromise()
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
  }

}
