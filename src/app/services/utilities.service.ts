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
import { ItemType } from '../datamodels/itemType';


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
  itemTypeList: ItemType[] = [];

  constructor(private dataService: DataService, private httpService: HttpService) {
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

    this.dataService.itemTypeList.subscribe(itemTypeList => {
      this.itemTypeList = itemTypeList;
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

  getStatusFromID(id: number) {
    return _.find(this.statusTypeList, statusType => statusType.id == id);
  }

  getItemTypeFromID(id: number) {
    return _.find(this.itemTypeList, itemType => itemType.id == id);
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

  getReceiptPDFParams(item: any) {
    if (item.itemTypeID == 1) { // itemTypeID 1: card
      const cardItem = _.find(this.cardList, card => card.id === item.cardID);
      return this.getCardPDFParams(cardItem);

    } else if (item.itemTypeID == 2) { // itemTypeID 2: document
      const documentItem = _.find(this.documentList, document => document.id === item.documentID);
      return this.getDocumentPDFParams(documentItem);

    }

    return ['', ''];
  }

  getCardPDFParams(card: Card) {
      const params: any[] = [2];
      params[0] = 'card';
      const fields: any[] = [7];
      fields[0] = card.cardNumber;
      fields[1] = card.cardType.name;
      fields[2] = '';
      fields[3] = moment(card.expirationDate).format('YYYY-MM-DD');
      fields[4] = ''; // card.comment.substring(0, 30);
      fields[5] = card.location;
      fields[6] = moment(card.modifiedDate).format('YYYY-MM-DD');

      if (card.user) {
        fields[2] = card.user.name;
      }

      if (card.comment) {
        if (card.comment.length >= 30) {
          fields[4] = card.comment.substring(0, 30);
        } else {
          fields[4] = card.comment;
        }
      }

      params[1] = fields;

      return params;
  }

  getDocumentPDFParams(document: Document) {
    const params: any[] = [2];
    params[0] = 'document';
    const fields: any[] = [10];
    fields[0] = document.documentNumber;
    fields[1] = document.name;
    fields[2] = document.documentType.name;
    fields[3] = document.sender;
    fields[4] = moment(document.documentDate).format('YYYY-MM-DD');
    fields[5] = moment(document.registrationDate).format('YYYY-MM-DD');
    fields[6] = '';
    fields[7] = ''; // document.comment.substring(0, 30);
    fields[8] = document.location;
    fields[9] = moment(document.modifiedDate).format('YYYY-MM-DD');

    if (document.user) {
      fields[6] = document.user.name;
    }

    if (document.comment) {
      if (document.comment.length >= 30) {
        fields[7] = document.comment.substring(0, 30);
      } else {
        fields[7] = document.comment;
      }
    }

    params[1] = fields;

    return params;
  }

  genPDF(params, number) {
    // Create new pdf
    this.httpService.httpPDF(params);
    delay(this.httpService, number);

    async function delay(httpService: HttpService, itemNumber) {
      await sleep(2000);
      httpService.httpGetPDF(itemNumber);
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

}
