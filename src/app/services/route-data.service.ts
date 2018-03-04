import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Card } from '../datamodels/card';

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

  constructor() { }

}
