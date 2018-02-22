import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Card } from '../datamodels/card';
import { HttpService } from './http.service';

@Injectable()
export class DataService {

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

  constructor(public httpService: HttpService) {
    this.getAllData();
  }

  getAllData() {
    this.getCardList();
  }

  getCardList() {
    this.httpService.httpGet<Card>('getAllCards').then(data => {
      this._cardList = data;
      this.cardList.next(this._cardList);
      console.log(data);
    });
  }
}
