import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Document } from '../../datamodels/document';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  documentList: Document[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentList.subscribe( (documentList) => {
      this.documentList = documentList;
    });

  }

  ngOnInit() {
  }

  

  

}