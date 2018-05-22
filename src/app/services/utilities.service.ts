import { Injectable, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { CardType } from '../datamodels/cardType';
import { DocumentType } from '../datamodels/documentType';
import { ItemType } from '../datamodels/itemType';
import { LogEvent } from '../datamodels/logEvent';
import { LogType } from '../datamodels/logType';
import { StatusType } from '../datamodels/statusType';
import { User } from '../datamodels/user';
import { UserType } from '../datamodels/userType';
import { VerificationType } from '../datamodels/verificationType';
import { DataService } from '../services/data.service';
import { HttpService } from './http.service';

/**
 * Function to make a string lowercase - lowerCase(ÅSA) returns åsa
 */
const reApos = /['\u2019]/g;
export const lowerCase = str =>
  _.reduce(
    _.words(_.toString(str).replace(reApos, '')),
    (result, word, index) => result + (index ? ' ' : '') + word.toLowerCase(),
    ''
  );

@Injectable()
export class UtilitiesService implements OnDestroy {
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  statusTypeList: StatusType[] = [];
  itemTypeList: ItemType[] = [];
  logTypeList: LogType[] = [];
  userTypeList: UserType[] = [];
  verificationTypeList: VerificationType[] = [];
  logEventList: LogEvent[] = [];

  dataServiceCardTypeSubscriber: any;

  dataServiceDocumentTypeSubscriber: any;

  dataServiceStatusTypeSubscriber: any;

  dataServiceItemTypeSubscriber: any;

  dataServiceLogTypeSubscriber: any;

  dataServiceUserTypeSubscriber: any;

  dataServiceVerificationTypeSubscriber: any;

  dataServiceLogEventSubscriber: any;

  constructor(private dataService: DataService, private httpService: HttpService) {
    this.dataServiceCardTypeSubscriber = this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });

    this.dataServiceDocumentTypeSubscriber = this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.dataServiceStatusTypeSubscriber = this.dataService.statusTypeList.subscribe(statusTypeList => {
      this.statusTypeList = statusTypeList;
    });

    this.dataServiceItemTypeSubscriber = this.dataService.itemTypeList.subscribe(itemTypeList => {
      this.itemTypeList = itemTypeList;
    });

    this.dataServiceLogTypeSubscriber = this.dataService.logTypeList.subscribe(logTypeList => {
      this.logTypeList = logTypeList;
    });

    this.dataServiceUserTypeSubscriber = this.dataService.userTypeList.subscribe(userTypeList => {
      this.userTypeList = userTypeList;
    });

    this.dataServiceVerificationTypeSubscriber = this.dataService.verificationTypeList.subscribe(
      verificationTypeList => {
        this.verificationTypeList = verificationTypeList;
      }
    );

    this.dataServiceLogEventSubscriber = this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
    });

    moment.locale('sv');

    moment.tz('Europe/Stockholm');
  }

  ngOnDestroy() {
    this.dataServiceCardTypeSubscriber.unsubscribe();

    this.dataServiceDocumentTypeSubscriber.unsubscribe();

    this.dataServiceStatusTypeSubscriber.unsubscribe();

    this.dataServiceItemTypeSubscriber.unsubscribe();

    this.dataServiceLogTypeSubscriber.unsubscribe();

    this.dataServiceUserTypeSubscriber.unsubscribe();

    this.dataServiceVerificationTypeSubscriber.unsubscribe();

    this.dataServiceLogEventSubscriber.unsubscribe();
  }

  /**
   * Fills in variables for new log event and returns it
   * @param itemTypeID specifies whether it is a card or a document
   * @param logTypeID specifies which log type it is
   * @param item item which the log event is for
   * @param user The user involved in this log event
   * @param logText relevant log text
   */
  createNewLogEventForItem(itemTypeID: number, logTypeID: number, item: any, user?: User, logText?: string): LogEvent {
    const logEvent = new LogEvent();
    logEvent.itemType = this.getItemTypeFromID(itemTypeID);
    logEvent.logType = this.getLogTypeFromID(logTypeID);
    if (itemTypeID == 1) {
      // For some reaason the following does not work here: ' logEvent.itemType.name == 'Kort' '
      logEvent.card = item;
    } else {
      logEvent.document = item;
    }
    logEvent.user = user;
    logEvent.logDate = new Date();
    if (logText) {
      logEvent.logText = logText;
    }
    return logEvent;
  }

  /**
   * Updates logEventList
   */
  updateLogEventList(logEvent: any) {
    logEvent.logDate = moment(logEvent.logDate).format('YYYY-MM-DD HH:mm:ss');
    this.logEventList.unshift(logEvent);
    this.logEventList = this.logEventList.slice();
    this.dataService.logEventList.next(this.logEventList);
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
