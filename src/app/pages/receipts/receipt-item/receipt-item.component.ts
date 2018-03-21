import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../datamodels/receipt';
import { DataService } from '../../../services/data.service';
import { CardType } from '../../../datamodels/cardType';
import { Card } from '../../../datamodels/card';
import { Document } from '../../../datamodels/document';
import { User } from '../../../datamodels/user';
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
  userList: User[] = [];

  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  itemActive: boolean;

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
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {
    this.getItem();
    this.setActiveReceipt();
  }

  setActiveReceipt() {
    this.itemActive = (this.receiptItem.endDate == null);
  }

  getItem() {
    if(this.receiptItem.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === this.receiptItem.cardID);

      this.itemIDToDisplay = cardItem.cardNumber;

      const itemType = _.find(this.cardTypeList, cardType => cardType.id === cardItem.cardType)
      this.itemTypeToDisplay = itemType.name;

      const user = _.find(this.userList, user => user.id === cardItem.userID)
      if(user) {
        this.itemUserNameToDisplay = user.name
      }

    } else if (this.receiptItem.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === this.receiptItem.documentID);

      this.itemIDToDisplay = documentItem.documentNumber;

      const itemType = _.find(this.documentTypeList, documentType => documentType.id === documentItem.documentType)
      this.itemTypeToDisplay = itemType.name;

      const user = _.find(this.userList, user => user.id === documentItem.userID)
      if(user) {
        this.itemUserNameToDisplay = user.name
      }

    }
    console.log(this.itemUserNameToDisplay);
  }



}