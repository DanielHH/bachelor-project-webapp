import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Document } from '../../datamodels/document';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  cardList: Card[] = [];
  documentList: Document[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
    this.dataService.documentList.subscribe(
      documentList => {
        this.documentList = documentList;
        console.log('new doc now, len:', documentList.length);
      },
      err => console.log('error'),
      () => console.log('complete')
    );
  }

  ngOnInit() {}
}
