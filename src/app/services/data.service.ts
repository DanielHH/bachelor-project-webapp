import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Card } from '../datamodels/card';
import { HttpService } from './http.service';
import { CardType } from '../datamodels/cardType';
import { Document } from '../datamodels/document';
import { DocumentType } from '../datamodels/documentType';
import { Receipt } from '../datamodels/receipt';
import { ItemType } from '../datamodels/itemType';
import { User } from '../datamodels/user';
import { Verification } from '../datamodels/verification';
import { VerificationType } from '../datamodels/verificationType';

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
   * A subscriber to the card list
   */
  verificationTypeList: BehaviorSubject<VerificationType[]> = new BehaviorSubject<VerificationType[]>(
    this._verificationTypeList
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

    this.getReceiptList();
    this.getItemTypeList();

    this.getVerificationList();
    this.getVerificationTypeList();
  }

  getUserList() {
    this.httpService.httpGet<User>('getUsers').then(data => {
      this._userList = data;
      this.userList.next(this._userList);
      console.log(data);
    });
  }

  getCardList() {
    this.httpService.httpGet<Card>('getCards').then(data => {
      this._cardList = data;
      this.cardList.next(this._cardList);
      console.log(data);
    });
  }

  getCardTypeList() {
    this.httpService.httpGet<CardType>('getCardTypes').then(data => {
      this._cardTypeList = data;
      this.cardTypeList.next(this._cardTypeList);
      console.log(data);
    });
  }

  getDocumentList() {
    this.httpService.httpGet<Document>('getDocuments').then(data => {
      this._documentList = data;
      this.documentList.next(this._documentList);
      console.log(data);
    });
  }

  getDocumentTypeList() {
    this.httpService.httpGet<DocumentType>('getDocumentTypes').then(data => {
      this._documentTypeList = data;
      this.documentTypeList.next(this._documentTypeList);
      console.log(data);
    });
  }

  getReceiptList() {
    this.httpService.httpGet<Receipt>('getReceipts').then(data => {
      this._receiptList = data;
      this.receiptList.next(this._receiptList);
      console.log(data);
    });
  }

  getItemTypeList() {
    this.httpService.httpGet<ItemType>('getItemTypes').then(data => {
      this._itemTypeList = data;
      this.itemTypeList.next(this._itemTypeList);
      console.log(data);
    });
  }

  getVerificationList() {
    this.httpService.httpGet<Verification>('getVerifications').then(data => {
      this._verificationList = data;
      this.verificationList.next(this._verificationList);
      console.log(data);
    });
  }

  getVerificationTypeList() {
    this.httpService.httpGet<VerificationType>('getVerificationTypes').then(data => {
      this._verificationTypeList = data;
      this.verificationTypeList.next(this._verificationTypeList);
      console.log(data);
    });
  }

}
