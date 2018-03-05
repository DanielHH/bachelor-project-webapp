import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  /**
   * API url
   */
  host = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  /**
   * Get request to given url
   * @param url request url
   */
  httpGet<T>(url: string) {
    return this.http.get(this.host + url).toPromise()
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
    .catch(error => {
      console.log(error);
    });
  }

}
