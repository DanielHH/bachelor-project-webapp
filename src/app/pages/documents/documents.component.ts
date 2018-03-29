import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../../datamodels/document';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { ModifyDocumentComponent } from './components/modify-document/modify-document.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documentList: Document[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentList.subscribe( (documentList) => {
      this.documentList = documentList;
    });

  }

  ngOnInit() {
  }

}
