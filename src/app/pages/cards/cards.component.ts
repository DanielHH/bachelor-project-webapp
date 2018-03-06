<<<<<<< HEAD
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
=======
import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { AddNewCardComponent } from './components/add-new-card/add-new-card.component';
import {MatDialog} from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cardList: Card[] = [];

  constructor(public dataService: DataService, public dialog: MatDialog) {
    this.dataService.cardList.subscribe( (cardList) => {
      this.cardList = cardList;
    });

  }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewCardComponent, {
      width: '800px',
      autoFocus: false
    });
  }



}
>>>>>>> dev
