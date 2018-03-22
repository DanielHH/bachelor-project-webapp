import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Document } from '../../datamodels/document';
import _ = require('lodash');

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  filteredDocumentList: Document[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentList.subscribe( (documentList) => {

      this.filteredDocumentList = _.filter(documentList, (document) => {
        return document.sender == 'Sectra';
      });

    });

  }

  ngOnInit() {
  }

}