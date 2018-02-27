import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Test } from '../../../../datamodels/test';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.scss']
})
export class GetComponent implements OnInit {

  testData = new Test();

  constructor(private httpService: HttpService) {
    this.getValueFromHttp();
   }

  ngOnInit() {
  }

  getValueFromHttp() {
    this.httpService.httpGet<Test>('').then(data => {
      this.testData = data as Test;
    });
  }

}

