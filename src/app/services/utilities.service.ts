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
import { LogType } from '../datamodels/logType';
import { UserType } from '../datamodels/userType';
import { VerificationType } from '../datamodels/verificationType';
import { LogEvent } from '../datamodels/logEvent';


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
  logTypeList: LogType[] = [];
  userTypeList: UserType[] = [];
  verificationTypeList: VerificationType[] = [];
  logEventList: LogEvent[] = [];

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

    this.dataService.logTypeList.subscribe(logTypeList => {
      this.logTypeList = logTypeList;
    });

    this.dataService.userTypeList.subscribe(userTypeList => {
      this.userTypeList = userTypeList;
    });

    this.dataService.verificationTypeList.subscribe(verificationTypeList => {
      this.verificationTypeList = verificationTypeList;
    });

    this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
    });
  }

  /**
   * Fills in variables for new log event
   */
  createNewLogEventForItem(itemTypeID: number, logTypeID: number, item: any, user?: User, logText?: string): LogEvent {
    const logEvent = new LogEvent();
    logEvent.itemType = this.getItemTypeFromID(itemTypeID);
    logEvent.logType = this.getLogTypeFromID(logTypeID);
    if (itemTypeID == 1) { // Av någon anledning funkar inte följande kod här: ' logEvent.itemType.name == 'Kort' '
      logEvent.card = item;
    } else {
      logEvent.document = item;
    }
    logEvent.user = user;
    logEvent.logDate = this.getLocalDate();
    if (logText) {
      logEvent.logText = logText;
    }
    return logEvent;
  }

  /**
   * Updates logEventList
   */
   updateLogEventList(logEvent: any) {
    this.logEventList.unshift(logEvent);
    this.logEventList = this.logEventList.slice();
    this.dataService.logEventList.next(this.logEventList);
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
   * Returns a string representation of date in given format
   * or in YYYY-MM-DD format if no format is specified
   */
  getDateString(date: Date, format?: string): string {
    format = format ? format : 'YYYY-MM-DD';
    return date ? moment(date).format(format) : '-';
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

  getUserFromID(id: number) {
    return _.find(this.userList, user => user.id == id);
  }

  getStatusFromID(id: number) {
    return _.find(this.statusTypeList, statusType => statusType.id == id);
  }

  getItemTypeFromID(id: number) {
    return _.find(this.itemTypeList, itemType => itemType.id == id);
  }

  getLogTypeFromID(id: number) {
    return _.find(this.logTypeList, logType => logType.id == id);
  }
  getUserTypeFromID(id: number) {
    return _.find(this.userTypeList, userType => userType.id == id);
  }

  getVerificationTypeFromID(id: number) {
    return _.find(this.verificationTypeList, verificationType => verificationType.id == id);
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
