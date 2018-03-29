import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// import { Http, RequestOptions, ResponseContentType, Headers } from '@angular/http';
import * as FileSaver from 'file-saver';

@Injectable()
export class HttpService {

  /**
   * API url
   */
   // host = 'http://localhost:8080/';
    host = 'http://api.nlsn.se/';

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

  httpPDF(body?: any) {
    return this.http.post(this.host + 'genPDF/', body).toPromise()
    .then(response => response['url'])
    .catch(error => {
      console.log(error);
      return '';
    });
  }

  /* httpGetPDF(body?: any) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'});
    const options = new RequestOptions({ headers: headers });
    options.responseType = ResponseContentType.Blob;
    const test = this.http.get(this.host + 'genPDF/', options).subscribe( (response) => {
      // Removed checking of valid response
      const fileBlob = response.blob();
      const blob = new Blob([fileBlob], {
         type: 'application/pdf' // must match the Accept type
      });
      console.log(body);
      FileSaver.saveAs(blob, body);
   });
  } */

  httpGetPDF(body?: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'});
    const options = {headers: headers, responseType: 'blob' as 'blob'};
    const test = this.http.get(this.host + 'genPDF/', options).subscribe( (response) => {
      // Removed checking of valid response
      const blob = new Blob([response], {
         type: 'application/pdf' // must match the Accept type
      });
      console.log(body);
      FileSaver.saveAs(blob, body);
   });
  }

}
