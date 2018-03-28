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
import { StatusType } from '../datamodels/statusType';
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
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];
  statusTypeList: StatusType[] = [];

  constructor(private dataService: DataService) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
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
    this.dataService.statusTypeList.subscribe(statusTypeList => {
      this.statusTypeList = statusTypeList;
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
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }

  /**
   * @returns a string array containing [id, kind, item type, user name] of receipt
   *
   * @param receipt receipt that the displayed data should be extracted from
   */
  getReceiptDisplay(receipt: Receipt) {
    let itemTypeToDisplay = '';
    let itemIdToDisplay = '';
    let itemUserNameToDisplay = '';

    if (receipt.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === receipt.cardID);
      itemIdToDisplay = cardItem.cardNumber;
      itemTypeToDisplay = cardItem.cardType.name;

      if (cardItem.user) {
        itemUserNameToDisplay = cardItem.user.name;
      }

    } else if (receipt.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === receipt.documentID);
      itemIdToDisplay = documentItem.documentNumber;
      itemTypeToDisplay = documentItem.documentType.name;

      if (documentItem.user) {
        itemUserNameToDisplay = documentItem.user.name;
      }
    }

    return [itemIdToDisplay, itemTypeToDisplay, itemUserNameToDisplay];
  }

  getStatusFromID(id: number) {
    return _.find(this.statusTypeList, statusType => statusType.id == id);
  }

  /**
   * Returns the cardType associated with name or id
   * @param id ID of card type
   * @param name Name of card type
   */
  getCardType(id?: number, name?: string) {
    return _.find(this.cardTypeList, cardType => cardType.id == id || cardType.name == name);
  }

    /**
   * Returns the documentType associated with name or id
   * @param id ID of document type
   * @param name Name of document type
   */
  getDocumentType(id?: number, name?: string) {
    return _.find(this.documentTypeList, documentType => documentType.id == id || documentType.name == name);
  }

  getPDFParams(item: any) {
    const params: any[] = [2];
    if (item.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === item.cardID);
      params[0] = 'card';
      const fields: any[] = [7];
      fields[0] = cardItem.cardNumber;
      fields[1] = cardItem.cardType.name;
      fields[2] = '';
      fields[3] = moment(cardItem.expirationDate).format('YYYY-MM-DD');
      fields[4] = cardItem.comment.substring(0, 30);
      fields[5] = cardItem.location;
      fields[6] = moment(cardItem.modifiedDate).format('YYYY-MM-DD');

      if (cardItem.user) {
        fields[2] = cardItem.user.name;
      }

      params[1] = fields;

    } else if (item.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === item.documentID);
      params[0] = 'document';
      const fields: any[] = [10];
      fields[0] = documentItem.documentNumber;
      fields[1] = documentItem.name;
      fields[2] = documentItem.documentType.name;
      fields[3] = documentItem.sender;
      fields[4] = moment(documentItem.documentDate).format('YYYY-MM-DD');
      fields[5] = moment(documentItem.registrationDate).format('YYYY-MM-DD');
      fields[6] = '';
      fields[7] = documentItem.comment.substring(0, 30);
      fields[8] = documentItem.location;
      fields[9] = moment(documentItem.modifiedDate).format('YYYY-MM-DD');

      if (documentItem.user) {
        fields[6] = documentItem.user.name;
      }
      params[1] = fields;
    }

    return params;
  }

}
