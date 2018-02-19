import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { Test } from '../../../../datamodels/test';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  test = new Test();

  constructor(private httpService: HttpService) {}

  ngOnInit() {
  }

  postValueToHttp() {

    this.httpService.httpPost<Test>('testPost/', this.test).then(data => {

      console.log(data);

    });
  }

}
