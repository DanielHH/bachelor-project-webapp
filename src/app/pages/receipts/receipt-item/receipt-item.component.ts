import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../datamodels/receipt';
import { DataService } from '../../../services/data.service';
import { CardType } from '../../../datamodels/cardType';
import { Card } from '../../../datamodels/card';
import { Document } from '../../../datamodels/document';
import { DocumentType } from '../../../datamodels/documentType';
import * as _ from 'lodash';

@Component({
  selector: 'app-receipt-item',
  templateUrl: './receipt-item.component.html',
  styleUrls: ['./receipt-item.component.scss']
})
export class ReceiptItemComponent implements OnInit {

  @Input() receiptItem: Receipt;

  cardList: Card[] = [];
  documentList: Document[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];

  activeReceipt() {
    return this.receiptItem.endDate == null;
  }

  constructor(private dataService: DataService) { 
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
    this.dataService.cardList.subscribe((cardList) => {
      this.cardList = cardList;
    });
    this.dataService.documentList.subscribe((documentList) => {
      this.documentList = documentList;
    });
  }

  ngOnInit() {
  }

}
