import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { Document } from '../../datamodels/document';
import { DataService } from '../../services/data.service';
import { BaseItem } from '../../datamodels/baseItem';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  cardList: Card[] = [];
  documentList: Document[] = [];
  baseItemList: BaseItem[] = new Array<BaseItem>();

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
      this.setItemList();
    });
    this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
      this.setItemList();
    });
  }

  ngOnInit() {}

  /**
   * Set the list of BaseItems to contain the cards and documents stored in their respective lists.
   */
  setItemList(): void {
    this.baseItemList = [];
    this.cardList.forEach(element => {
      this.baseItemList.push(new BaseItem(element, 'card'));
    });
    this.documentList.forEach(element => {
      this.baseItemList.push(new BaseItem(element, 'document'));
    });
  }
}
