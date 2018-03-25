import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { HttpService } from './http.service';
import { Receipt } from '../datamodels/receipt';
import { Card } from '../datamodels/card';
import { CardType } from '../datamodels/cardType';
import { Document } from '../datamodels/document';
import { DocumentType } from '../datamodels/documentType';
import { User } from '../datamodels/user';
import { DataService } from '../services/data.service';
import * as moment from 'moment';


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

  constructor(private dataService: DataService) {

    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.dataService.cardTypeList.subscribe((cardTypeList) => {
      this.cardTypeList = cardTypeList;
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
   * Returns a Date object representing current local time
   */
  getLocalDate(): Date {
    const localDate = new Date();
    localDate.setHours(localDate.getHours() - localDate.getTimezoneOffset() / 60);
    return localDate;
  }

  /**
   * Returns a string representation of date
   */
  getDateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Returns the string associated with cardTypeId
   * @param cardTypeId Id of card type
   */
  getCardTypeString(cardTypeId: number) {
    return _.find(this.cardTypeList, cardType => cardType.id === cardTypeId).name;
  }

  /**
   * Returns the string associated with cardTypeId
   * @param documentTypeId Id of card type
   */
  getDocumentTypeString(documentTypeId: number) {
    return _.find(this.documentTypeList, documentType => documentType.id === documentTypeId).name;
  }

  /**
   * Returns the string associated with userId
   * @param userId Id of user
   */
  getUserString(userId: number) {
    return _.find(this.userList, user => user.id === userId).name;
  }

  /**
   * @returns a string array containing [id, kind, item type, user name] of receipt
   *
   * @param receipt receipt that the displayed data should be extracted from
   */
  getReceiptDisplay(receipt: Receipt) {
    let itemKindToDisplay = '';
    let itemTypeToDisplay = '';
    let itemIdToDisplay = '';
    let itemUserNameToDisplay = '';

    if (receipt.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === receipt.cardID);
      itemKindToDisplay = 'Kort';
      itemIdToDisplay = cardItem.cardNumber;
      itemTypeToDisplay = this.getCardTypeString(cardItem.cardType);

    } else if (receipt.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === receipt.documentID);
      itemKindToDisplay = 'Handling';
      itemIdToDisplay = documentItem.documentNumber;
      itemTypeToDisplay = this.getCardTypeString(documentItem.documentType);
    }

    const itemUser = _.find(this.userList, user => user.id === receipt.userID);
    if (itemUser) {
      itemUserNameToDisplay = itemUser.name;
    }

    return [itemIdToDisplay, itemKindToDisplay, itemTypeToDisplay, itemUserNameToDisplay];
  }

}
