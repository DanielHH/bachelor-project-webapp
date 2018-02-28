import { Component, OnInit } from '@angular/core';
import { Document } from '../../datamodels/document';
import {MatDialog} from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documentList: Document[] = [];

  constructor(public dataService: DataService, public dialog: MatDialog) {
    this.dataService.documentList.subscribe( (documentList) => {
      this.documentList = documentList;
    });

  }

  ngOnInit() {
  }

}
