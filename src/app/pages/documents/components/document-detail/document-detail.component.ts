import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Document } from '../../../../datamodels/document';

import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { RouteDataService } from '../../../../services/route-data.service';
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {

  documentDetail: Document;

  constructor(private routeDataService: RouteDataService) {
    this.routeDataService.document.subscribe((document) => {
      this.documentDetail = document;
    });

  }
  ngOnInit() {
  }

}
