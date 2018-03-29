import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Card } from '../datamodels/card';
import { HttpService } from './http.service';
import { CardType } from '../datamodels/cardType';
import { Document } from '../datamodels/document';
import { Delivery } from '../datamodels/delivery';
import { DocumentType } from '../datamodels/documentType';
import { Receipt } from '../datamodels/receipt';
import { ItemType } from '../datamodels/itemType';
import { User } from '../datamodels/user';
import { Verification } from '../datamodels/verification';
import { VerificationType } from '../datamodels/verificationType';
import { StatusType } from '../datamodels/statusType';

@Injectable()
export class DataService {

  /**
   * List with all users
   */
  _userList: User[] = [];

  /**
   * A subscriber to the user list
   */
  userList: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    this._userList
  );

  /**
   * List with all cards
   */
  _cardList: Card[] = [];

  /**
   * A subscriber to the card list
   */
  cardList: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>(
    this._cardList
  );

  /**
   * List with all cards
   */
  _cardTypeList: CardType[] = [];

  /**
   * A subscriber to the card list
   */
  cardTypeList: BehaviorSubject<CardType[]> = new BehaviorSubject<CardType[]>(
    this._cardTypeList
  );

  /**
   * List with all documents
   */
  _documentList: Document[] = [];

  /**
   * A subscriber to the document list
   */
  documentList: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>(
    this._documentList
  );

    /**
   * List with all deliverys
   */
  _deliveryList: Delivery[] = [];

  /**
   * A subscriber to the document list
   */
  deliveryList: BehaviorSubject<Delivery[]> = new BehaviorSubject<Delivery[]>(
    this._deliveryList
  );

  /**
   * List with all document types
   */
  _documentTypeList: DocumentType[] = [];

  /**
   * A subscriber to the document type list
   */
  documentTypeList: BehaviorSubject<DocumentType[]> = new BehaviorSubject<DocumentType[]>(
    this._documentTypeList
  );

  /**
   * List with all receipts
   */
  _receiptList: Receipt[] = [];

  /**
   * A subscriber to the receipt list
   */
  receiptList: BehaviorSubject<Receipt[]> = new BehaviorSubject<Receipt[]>(
    this._receiptList
  );

  /**
   * List with all item types
   */
  _itemTypeList: ItemType[] = [];

  /**
   * A subscriber to the item type list
   */
  itemTypeList: BehaviorSubject<ItemType[]> = new BehaviorSubject<ItemType[]>(
    this._itemTypeList
  );

  /**
   * List with all verifications
   */
  _verificationList: Verification[] = [];

  /**
   * A subscriber to the verification list
   */
  verificationList: BehaviorSubject<Verification[]> = new BehaviorSubject<Verification[]>(
    this._verificationList
  );

  /**
   * List with all verification types
   */
  _verificationTypeList: VerificationType[] = [];

  /**
   * A subscriber to the verification type list
   */
  verificationTypeList: BehaviorSubject<VerificationType[]> = new BehaviorSubject<VerificationType[]>(
    this._verificationTypeList
  );

  /**
   * List with all status types
   */
  _statusTypeList: StatusType[] = [];

  /**
   * A subscriber to the status type list
   */
  statusTypeList: BehaviorSubject<StatusType[]> = new BehaviorSubject<StatusType[]>(
    this._statusTypeList
  );

  constructor(public httpService: HttpService) {
    this.getAllData();
  }

  getAllData() {
    this.getUserList();

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
  }

  getUserList() {
    this.httpService.httpGet<User>('getUsers').then(data => {
      this._userList = data as User[];
      this.userList.next(this._userList);
    });
  }

  getCardList() {
    this.httpService.httpGet<Card>('getCards').then(data => {
      this._cardList = data as Card[];
      this.cardList.next(this._cardList);
    });
  }

  getCardTypeList() {
    this.httpService.httpGet<CardType>('getCardTypes').then(data => {
      this._cardTypeList = data as CardType[];
      this.cardTypeList.next(this._cardTypeList);
    });
  }

  getDocumentList() {
    this.httpService.httpGet<Document>('getDocuments').then(data => {
      this._documentList = data as Document[];
      this.documentList.next(this._documentList);
    });
  }

  getDeliveryList() {
    this.httpService.httpGet<Delivery>('getDeliveries').then(data => {
      this._deliveryList = data as Delivery[];
      this.deliveryList.next(this._deliveryList);
    });
  }

  getDocumentTypeList() {
    this.httpService.httpGet<DocumentType>('getDocumentTypes').then(data => {
      this._documentTypeList = data as DocumentType[];
      this.documentTypeList.next(this._documentTypeList);
    });
  }

  getReceiptList() {
    this.httpService.httpGet<Receipt>('getReceipts').then(data => {
      this._receiptList = data as Receipt[];
      this.receiptList.next(this._receiptList);
    });
  }

  getItemTypeList() {
    this.httpService.httpGet<ItemType>('getItemTypes').then(data => {
      this._itemTypeList = data as ItemType[];
      this.itemTypeList.next(this._itemTypeList);
    });
  }

  getVerificationList() {
    this.httpService.httpGet<Verification>('getVerifications').then(data => {
      this._verificationList = data as Verification[];
      this.verificationList.next(this._verificationList);
    });
  }

  getVerificationTypeList() {
    this.httpService.httpGet<VerificationType>('getVerificationTypes').then(data => {
      this._verificationTypeList = data as VerificationType[];
      this.verificationTypeList.next(this._verificationTypeList);
    });
  }

  getStatusTypeList() {
    this.httpService.httpGet<StatusType>('getStatusTypes').then(data => {
      this._statusTypeList = data as StatusType[];
      this.statusTypeList.next(this._statusTypeList);
    });
  }

}
