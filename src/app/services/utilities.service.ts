import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Receipt } from '../datamodels/receipt';
import { Card } from '../datamodels/card';
import { CardType } from '../datamodels/cardType';
import { Document } from '../datamodels/document';
import { DocumentType } from '../datamodels/documentType';
import { User } from '../datamodels/user';
import { DataService } from '../services/data.service';


/**
 * Function to make a string lowercase - lowerCase(ÅSA) returns åsa
*/
const reApos = /['\u2019]/g;
export const lowerCase = (str) => _.reduce(
  _.words(_.toString(str).replace(reApos, '')),
  (result, word, index) => result + (index ? ' ' : '') + word.toLowerCase(),
  ''
);

@Injectable()
export class UtilitiesService {

  cardList: Card[] = [];
  documentList: Document[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

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
  
/**
 * Helper function to get the actual unique serial number, type and user of a receipt
 * to be displayed
 * 
 * @returns an string array containing [serial number, item type, user name]
 * 
 * @param receipt receipt that the displayed data should be extracted from
 */
  getReceiptDisplay(receipt: Receipt) {
    
    if(receipt.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === receipt.cardID);

      this.itemIDToDisplay = cardItem.cardNumber;

      const itemType = _.find(this.cardTypeList, cardType => cardType.id === cardItem.cardType)
      this.itemTypeToDisplay = itemType.name;

      const user = _.find(this.userList, user => user.id === receipt.userID)
      if(user) {
        this.itemUserNameToDisplay = user.name
      }

    } else if (receipt.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === receipt.documentID);

      this.itemIDToDisplay = documentItem.documentNumber;

      const itemType = _.find(this.documentTypeList, documentType => documentType.id === documentItem.documentType)
      this.itemTypeToDisplay = itemType.name;

      const user = _.find(this.userList, user => user.id === receipt.userID)
      if(user) {
        this.itemUserNameToDisplay = user.name
      }

    }
    return [this.itemIDToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay]
  }

  /**
   * Helper function to get the local date
   */
  getLocalDate() {
    const localDate = new Date();
    localDate.setHours(localDate.getHours() - localDate.getTimezoneOffset() / 60);
    return localDate;
  }

}
