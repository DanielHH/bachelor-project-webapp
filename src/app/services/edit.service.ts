import { Injectable } from '@angular/core';
import { Card } from '../datamodels/card';
import { Document } from '../datamodels/document';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EditService {

  /**
   * Edit card
   */
  private _card = new Card();

  /**
   * A subscriber to the edit card
   */
  card: BehaviorSubject<Card> = new BehaviorSubject<Card>(
    this._card
  );

   /**
   * Edit document
   */
  private _document = new Document();

   /**
   * A subscriber to the edit document
   */
  document: BehaviorSubject<Document> = new BehaviorSubject<Document>(
    this._document
  );


  constructor() { }

}
