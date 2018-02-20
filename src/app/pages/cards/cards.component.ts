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
  newCard = false;
  filterInput = '';
  cardList: Card[] = [];

  constructor(private httpService: HttpService) {
    this.getCards();
  }

  ngOnInit() {
  }

  filter() {

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
      expirationDate: new Date()
    };

    this.cardList.push(cardOne);
    this.cardList.push(cardOne);
    this.cardList.push(cardOne);
    /*if (this.newCard) {
      this.cardList.push(cardOne);
    }
    this.newCard = true;
    // console.log('This is sparta');*/
    /*this.httpService.httpGet<Card>('/getCards').then(data => {
      this.cardList = data;
    });*/
  }

}
