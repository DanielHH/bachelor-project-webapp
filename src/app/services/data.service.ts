import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Card } from '../datamodels/card';
import { HttpService } from './http.service';
import { CardType } from '../datamodels/cardType';

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

  constructor(public httpService: HttpService) {
    this.getAllData();
  }

  getAllData() {
    this.getCardList();
    this.getCardTypeList();
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
}
