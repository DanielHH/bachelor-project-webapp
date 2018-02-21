import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  showAddNewCard = true;
  cardList: Card[] = [];

  constructor(private httpService: HttpService) {
    this.getCards();
  }

  ngOnInit() {
  }

  getCards() {
    const cardOne: Card = {
      id: 0,
      cardType: 1,
      cardNumber: '123',
      userID: 1234,
      user: 'Jennifer',
      location: 'Zimbabwe',
      comment: 'Varför?!?!??!',
      expirationDate: new Date(),
      status: false
    };

    const cardTwo: Card = {
      id: 0,
      cardType: 2,
      cardNumber: 'AW3',
      userID: 909,
      user: 'Niklas',
      location: 'Kina',
      comment: 'Därför!!!!',
      expirationDate: new Date(),
      status: false
    };

    cardTwo.expirationDate.setDate(cardTwo.expirationDate.getDate() + 1);

    this.cardList.push(cardTwo);
    this.cardList.push(cardOne);

  }

}
