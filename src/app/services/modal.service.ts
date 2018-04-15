import { Injectable } from '@angular/core';
import { Card } from '../datamodels/card';
import { Document } from '../datamodels/document';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Delivery } from '../datamodels/delivery';
import { CardType } from '../datamodels/cardType';
import { DocumentType } from '../datamodels/documentType';
import { BaseType } from '../datamodels/baseType';
import { User } from '../datamodels/user';
import { BaseItem } from '../datamodels/baseItem';
import { Receipt } from '../datamodels/receipt';
import { LogEvent } from '../datamodels/logEvent';

@Injectable()
export class ModalService {

  /**
   * Card detail
   */
  private _detailCard = new Card();

  /**
   * A subscriber to the detail card
   */
  detailCard: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._detailCard
  );

  /**
   * Detail document
   */
  private _detailDocument = new Document();

   /**
   * A subscriber to the detail document
   */
  detailDocument: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._detailDocument
  );

  /**
   * Detail delivery
   */
  private _detailDelivery = new Delivery();

   /**
   * A subscriber to the detail delivery
   */
  detailDelivery: BehaviorSubject<Delivery> = new BehaviorSubject<Delivery>(
    this._detailDelivery
  );

  /**
   * Detail receipt
   */
  private _detailReceipt = new Receipt();

   /**
   * A subscriber to the detail receipt
   */
  detailReceipt: BehaviorSubject<Receipt> = new BehaviorSubject<Receipt>(
    this._detailReceipt
  );

  /**
   * Detail LogEvent
   */
  private _detailLogEvent = new LogEvent();

   /**
   * A subscriber to the detail LogEvent
   */
  detailLogEvent: BehaviorSubject<LogEvent> = new BehaviorSubject<LogEvent>(
    this._detailLogEvent
  );

  /**
   * Detail inventory
   */
  private _detailInventory = new BaseItem(null, new Card(), 'card');

   /**
   * A subscriber to the detail inventory
   */
  detailInventory: BehaviorSubject<BaseItem> = new BehaviorSubject<BaseItem>(
    this._detailInventory
  );

  /**
   * Detail user
   */
  private _detailUser = new User();

   /**
   * A subscriber to the detail user
   */
  detailUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    this._detailUser
  );

  /**
   * Edit card
   */
  private _editCard = new Card();

  /**
   * A subscriber to the edit card
   */
  editCard: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._editCard
  );

   /**
   * Edit document
   */
  private _editDocument = new Document();

   /**
   * A subscriber to the edit document
   */
  editDocument: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._editDocument
  );

  /**
   * Edit delivery
   */
  private _editDelivery = new Delivery();

   /**
   * A subscriber to the edit delivery
   */
  editDelivery: BehaviorSubject<Delivery> = new BehaviorSubject<Delivery>(
    this._editDelivery
  );

  /**
   * Requested card
   */
  private _requestCard = new Card();

  /**
   * A subscriber to the requested card
   */
  requestCard: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._requestCard
  );

   /**
   * Requested document
   */
  private _requestDocument = new Document();

   /**
   * A subscriber to the requested document
   */
  requestDocument: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._requestDocument
  );

  /**
   * Returning card
   */
  private _returnCard = new Card();

  /**
   * A subscriber to the returning card
   */
  returnCard: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._returnCard
  );

   /**
   * Returning document
   */
  private _returnDocument = new Document();

   /**
   * A subscriber to the returning document
   */
  returnDocument: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._returnDocument
  );

  /**
   * Edit type
   */
  private _editType = new BaseType(new CardType(), 'cardType');

   /**
   * A subscriber to the Type to be edited
   */
  editType: BehaviorSubject<BaseType> = new BehaviorSubject<BaseType>(
    this._editType
  );

  /**
   * Edit user
   */
  private _editUser = new User();

   /**
   * A subscriber to the user to be edited
   */
  editUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    this._editUser
  );

  constructor() { }

}
