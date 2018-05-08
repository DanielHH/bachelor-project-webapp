import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';

@Injectable()
export class HttpService {
  /**
   * API url
   */
  host = 'http://localhost:8080/';
  // host = 'http://api.nlsn.se/';

  constructor(private http: Http) {}

  /**
   * Get request to given url
   * @param url request url
   */
  httpGet<T>(url: string) {
    return this.http
      .get(this.host + url)
      .toPromise()
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
    return this.http
      .post(this.host + url, body)
      .toPromise()
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
    return this.http
      .put(this.host + url, body)
      .toPromise()
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      });
  }

  httpPDF(body?: any) {
    return this.http
      .post(this.host + 'genPDF/', body)
      .toPromise()
      .then(response => response.url)
      .catch(error => {
        console.log(error);
        return '';
      });
  }

  httpGetPDF(url: string) {
    this.http
      .get(url, { responseType: ResponseContentType.Blob })
      .toPromise()
      .then(response => {
        const blob = new Blob([response.blob()], {
          type: 'application/pdf' // must match the Accept type
        });

        FileSaver.saveAs(blob, _.last(_.split(url, '/')));
      });
  }
}
