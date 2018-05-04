import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../auth/auth.service';
import { BaseItem } from '../datamodels/baseItem';
import { BaseType } from '../datamodels/baseType';
import { Card } from '../datamodels/card';
import { CardType } from '../datamodels/cardType';
import { Delivery } from '../datamodels/delivery';
import { Document } from '../datamodels/document';
import { DocumentType } from '../datamodels/documentType';
import { ItemType } from '../datamodels/itemType';
import { LogEvent } from '../datamodels/logEvent';
import { LogType } from '../datamodels/logType';
import { Receipt } from '../datamodels/receipt';
import { StatusType } from '../datamodels/statusType';
import { User } from '../datamodels/user';
import { UserType } from '../datamodels/userType';
import { Verification } from '../datamodels/verification';
import { VerificationType } from '../datamodels/verificationType';
import { HttpService } from './http.service';
import * as _ from 'lodash';

@Injectable()
export class DataService {
  /**
   * List with all users
   */
  private _userList: User[] = [];

  /**
   * A subscriber to the user list
   */
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this._userList);

  /**
   * List with all cards
   */
  private _cardList: Card[] = [];

  /**
   * A subscriber to the card list
   */
  cardList: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>(this._cardList);

  /**
   * List with all cards
   */
  private _cardTypeList: CardType[] = [];

  /**
   * A subscriber to the card list
   */
  cardTypeList: BehaviorSubject<CardType[]> = new BehaviorSubject<CardType[]>(this._cardTypeList);

  /**
   * List with all documents
   */
  private _documentList: Document[] = [];

  /**
   * A subscriber to the document list
   */
  documentList: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>(this._documentList);

  /**
   * List with all deliverys
   */
  private _deliveryList: Delivery[] = [];

  /**
   * A subscriber to the document list
   */
  deliveryList: BehaviorSubject<Delivery[]> = new BehaviorSubject<Delivery[]>(this._deliveryList);

  /**
   * List with all document types
   */
  private _documentTypeList: DocumentType[] = [];

  /**
   * A subscriber to the document type list
   */
  documentTypeList: BehaviorSubject<DocumentType[]> = new BehaviorSubject<DocumentType[]>(this._documentTypeList);

  /**
   * List with all receipts
   */
  private _receiptList: Receipt[] = [];

  /**
   * A subscriber to the receipt list
   */
  receiptList: BehaviorSubject<Receipt[]> = new BehaviorSubject<Receipt[]>(this._receiptList);

  /**
   * List with all item types
   */
  private _itemTypeList: ItemType[] = [];

  /**
   * A subscriber to the item type list
   */
  itemTypeList: BehaviorSubject<ItemType[]> = new BehaviorSubject<ItemType[]>(this._itemTypeList);

  /**
   * List with all log types
   */
  private _logTypeList: LogType[] = [];

  /**
   * A subscriber to the log type list
   */
  logTypeList: BehaviorSubject<LogType[]> = new BehaviorSubject<LogType[]>(this._logTypeList);

  /**
   * List with all verifications
   */
  private _verificationList: Verification[] = [];

  /**
   * A subscriber to the verification list
   */
  verificationList: BehaviorSubject<Verification[]> = new BehaviorSubject<Verification[]>(this._verificationList);

  /**
   * List with all verification types
   */
  private _verificationTypeList: VerificationType[] = [];

  /**
   * A subscriber to the verification type list
   */
  verificationTypeList: BehaviorSubject<VerificationType[]> = new BehaviorSubject<VerificationType[]>(
    this._verificationTypeList
  );

  /**
   * List with all status types
   */
  private _statusTypeList: StatusType[] = [];

  /**
   * A subscriber to the status type list
   */
  statusTypeList: BehaviorSubject<StatusType[]> = new BehaviorSubject<StatusType[]>(this._statusTypeList);

  /**
   * List with all log events
   */
  private _logEventList: LogEvent[] = [];

  /**
   * A subscriber to the log event list
   */
  logEventList: BehaviorSubject<LogEvent[]> = new BehaviorSubject<LogEvent[]>(this._logEventList);

  /**
   * List with all cards and documents as BaseItems
   */
  private _itemList: BaseItem[] = [];

  /**
   * A subscriber to the cards and documents list
   */
  itemList: BehaviorSubject<BaseItem[]> = new BehaviorSubject<BaseItem[]>(this._itemList);

  /**
   * List with all card and document types
   */
  private _typeList: BaseType[] = [];

  /**
   * A subscriber to the card and document type list
   */
  typeList: BehaviorSubject<BaseType[]> = new BehaviorSubject<BaseType[]>(this._typeList);

  /**
   * List with all user types
   */
  private _userTypeList: UserType[] = [];

  /**
   * A subscriber to the user type list
   */
  userTypeList: BehaviorSubject<UserType[]> = new BehaviorSubject<UserType[]>(this._userTypeList);

  userURL = '';

  constructor(private httpService: HttpService, private authService: AuthService) {
    this.authService.user.subscribe(user => {
      if (user && user.id) {
        if (user.userType.id == 1) {
          this.getAllData();
        } else if (user.userType.id == 2) {
          this.userURL = '?userID=' + user.id;
          this.getUserData();
        }
      } else {
        this.userURL = '';
        this.resetAllData();
      }
    });
  }

  getAllData() {
    this.getUserList();
    this.getUserTypeList();

    this.getCardList();
    this.getCardTypeList();

    this.getDocumentList();
    this.getDocumentTypeList();

    this.getDeliveryList();

    this.getReceiptList();
    this.getItemTypeList();

    this.getVerificationList();
    this.getVerificationTypeList();

    this.getStatusTypeList();

    this.getLogEventList();
    this.getLogTypeList();
  }

  resetAllData() {
    this._userList = null;
    this.userList.next(this._userList);

    this._userTypeList = null;
    this.userTypeList.next(this._userTypeList);

    this._cardList = null;
    this.cardList.next(this._cardList);

    this._documentList = null;
    this.documentList.next(this._documentList);

    this._deliveryList = null;
    this.deliveryList.next(this._deliveryList);

    this._receiptList = null;
    this.receiptList.next(this._receiptList);

    this._logEventList = null;
    this.logEventList.next(this._logEventList);

    this._verificationList = null;
    this.verificationList.next(this._verificationList);

    this._itemList = null;
    this.itemList.next(this._itemList);

    this._typeList = null;
    this.typeList.next(this._typeList);
  }

  getUserData() {
    this.getDocumentList();

    this.getReceiptList();

    this.getVerificationList();

    this.getCardList();

    this.getItemTypeList();

    this.getVerificationTypeList();

    this.getLogTypeList();

    this.getStatusTypeList();

    this.getCardTypeList();

    this.getDocumentTypeList();
  }

  getUserList() {
    this.httpService.httpGet<User>('getUsers').then(data => {
      this._userList = data;
      this.userList.next(this._userList);
    });
  }

  getUserTypeList() {
    this.httpService.httpGet<UserType>('getUserTypes').then(data => {
      this._userTypeList = data;
      this.userTypeList.next(this._userTypeList);
    });
  }

  getCardList() {
    this.httpService.httpGet<Card>('getCards' + this.userURL).then(data => {
      this._cardList = data;
      this.cardList.next(this._cardList);
      this.setItemList();
    });
  }

  getCardTypeList() {
    this.httpService.httpGet<CardType>('getCardTypes').then(data => {
      this._cardTypeList = data;
      this.cardTypeList.next(this._cardTypeList);
      this.setTypeList();
    });
  }

  getDocumentList() {
    this.httpService.httpGet<Document>('getDocuments' + this.userURL).then(data => {
      this._documentList = data;
      this.documentList.next(this._documentList);
      this.setItemList();
    });
  }

  getDeliveryList() {
    this.httpService.httpGet<Delivery>('getDeliveries').then(data => {
      this._deliveryList = data;
      this.deliveryList.next(this._deliveryList);
    });
  }

  getDocumentTypeList() {
    this.httpService.httpGet<DocumentType>('getDocumentTypes').then(data => {
      this._documentTypeList = data;
      this.documentTypeList.next(this._documentTypeList);
      this.setTypeList();
    });
  }

  getReceiptList() {
    this.httpService.httpGet<Receipt>('getReceipts' + this.userURL).then(data => {
      this._receiptList = data;
      this.receiptList.next(this._receiptList);
    });
  }

  getItemTypeList() {
    this.httpService.httpGet<ItemType>('getItemTypes').then(data => {
      this._itemTypeList = data;
      this.itemTypeList.next(this._itemTypeList);
    });
  }

  getVerificationList() {
    this.httpService.httpGet<Verification>('getVerifications' + this.userURL).then(data => {
      this._verificationList = data;
      this.verificationList.next(this._verificationList);
    });
  }

  getVerificationTypeList() {
    this.httpService.httpGet<VerificationType>('getVerificationTypes').then(data => {
      this._verificationTypeList = data;
      this.verificationTypeList.next(this._verificationTypeList);
    });
  }

  getStatusTypeList() {
    this.httpService.httpGet<StatusType>('getStatusTypes').then(data => {
      this._statusTypeList = data;
      this.statusTypeList.next(this._statusTypeList);
    });
  }

  getLogEventList() {
    this.httpService.httpGet<LogEvent>('getLogEvents').then(data => {
      this._logEventList = data;
      this.logEventList.next(this._logEventList);
    });
  }

  getLogTypeList() {
    this.httpService.httpGet<LogType>('getLogTypes').then(data => {
      this._logTypeList = data;
      this.logTypeList.next(this._logTypeList);
    });
  }

  setItemList() {
    if (this._cardList && this._documentList) {
      this._itemList = [];

      _.forEach(this._cardList, card => {
        this._itemList.push(new BaseItem(card, 'card'));
      });

      _.forEach(this._documentList, document => {
        this._itemList.push(new BaseItem(document, 'document'));
      });

      this.itemList.next(this._itemList);
    }
  }

  setTypeList() {
    this._typeList = [];

    _.forEach(this._cardTypeList, type => {
      this._typeList.unshift(new BaseType(type, 'cardType'));
    });

    _.forEach(this._documentTypeList, type => {
      this._typeList.unshift(new BaseType(type, 'documentType'));
    });

    this.typeList.next(this._typeList);
  }
}
