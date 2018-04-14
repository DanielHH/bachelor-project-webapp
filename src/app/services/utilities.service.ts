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
import { UserType } from '../datamodels/userType';


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
  userTypeList: UserType[] = [];

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

    this.dataService.userTypeList.subscribe(userTypeList => {
      this.userTypeList = userTypeList;
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
    return date ? moment(date).format('YYYY-MM-DD') : '-';
  }

  /**
   * Returns a string representation of user
   */
  getUserString(user: User): string {
    if (user && user.id) {
      return user.name + ' <' + user.username + '>';
    } else {
      return '-';
    }
  }

  getStatusFromID(id: number) {
    return _.find(this.statusTypeList, statusType => statusType.id == id);
  }

  getItemTypeFromID(id: number) {
    return _.find(this.itemTypeList, itemType => itemType.id == id);
  }

  getUserTypeFromID(id: number) {
    return _.find(this.userTypeList, userType => userType.id == id);
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

  /**
   * Returns true if user is has Admin UserType, else false
   */
  isAdmin(user: User) {
    return user.userType.id === 1;
  }

  /**
   * Returns true if user is has User UserType, else false
   */
  isUser(user: User) {
    return user.userType.id === 2;
  }

}
