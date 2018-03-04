import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Card } from '../datamodels/card';
import { Document } from '../datamodels/document';

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

  constructor() { }

}
