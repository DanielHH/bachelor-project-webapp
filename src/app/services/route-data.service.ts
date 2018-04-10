import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Card } from '../datamodels/card';
import { Document } from '../datamodels/document';
import { Delivery } from '../datamodels/delivery';

@Injectable()
export class RouteDataService {

  /**
   * Route data card
   */
  private _card = new Card();

  /**
   * A subscriber to the route data card
   */
  card: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._card
  );

   /**
   * Route data document
   */
  private _document = new Document();

   /**
   * A subscriber to the route data document
   */
  document: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._document
  );

   /**
   * Route data document
   */
  private _delivery = new Delivery();

   /**
   * A subscriber to the route data document
   */
  delivery: BehaviorSubject<Delivery> = new BehaviorSubject<Delivery>(
    this._delivery
  );

  constructor() { }

}
