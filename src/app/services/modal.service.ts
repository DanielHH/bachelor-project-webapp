import { Injectable } from '@angular/core';
import { Card } from '../datamodels/card';
import { Document } from '../datamodels/document';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Delivery } from '../datamodels/delivery';

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


  constructor() { }

}
