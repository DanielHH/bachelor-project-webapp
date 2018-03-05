import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  showAddNewCard = true;

  cardList: Card[] = [];

  constructor() {

    const cardOne: Card = {
      id: 0,
      cardType: 1,
      cardNumber: '123',
      userID: 1234,
      user: 'Jennifer',
      location: 'Zimbabwe',
      comment: 'Varför?!?!??!',
      expirationDate: new Date()
    };

    this.cardList.push(cardOne);
    this.cardList.push(cardOne);
    this.cardList.push(cardOne);
  }

  ngOnInit() {
  }

}
