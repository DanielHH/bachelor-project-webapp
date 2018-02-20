import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  newCard = new Card();

  // Form Controls
  cardTypeControl = new FormControl('', Validators.required);
  cardNumberControl = new FormControl('', Validators.required);
  userIDControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);

  cardTypes = [
    'Type 1',
    'Type 2',
    'Type 3',
    'Type 4',
  ];

  userIDs = [
    'Jennifer',
    'Niklas',
    'Philip',
    'Johan',
    'David',
    'Daniel',
    'Andreas'
  ];

  constructor(private httpService: HttpService) { }

  filteredCardTypes: Observable<string[]>;
  filteredUserIDs: Observable<string[]>;

  ngOnInit() {
    this.filteredCardTypes = this.cardTypeControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterCardTypes(val))
      );

    this.filteredUserIDs = this.userIDControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserIDs(val))
    );
  }

  filterCardTypes(val: string): string[] {
    return this.cardTypes.filter(cardType =>
      cardType.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  filterUserIDs(val: string): string[] {
    return this.userIDs.filter(userID =>
      userID.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  addNewCard() {
    this.httpService.httpPost<Card>('addNewCard/', this.newCard).then(data => {

      console.log(data);

    });
  }

  getCardTypeInputFontColor() {
    if (this.newCard.cardType) {
      return 'black';
    } else {
      return 'gray';
    }
  }

  getUserIDInputFontColor() {
    if (this.newCard.userID) {
      return 'black';
    } else {
      return 'gray';
    }
  }

  setCardType(data: any) {
    this.newCard.cardType = data.option.value;
  }

  setCardNumber(data: any) {
    this.newCard.cardNumber = data.data;
  }

  setUserID(data: any) {
    this.newCard.userID = data.option.value;
  }

  setUser(data: any) {
    this.newCard.user = data.data;
  }

  setLocation(data: any) {
    this.newCard.location = data.data;
  }

  setComment(data: any) {
    this.newCard.comment = data.data;
  }

  setExpirationDate(data: any) {
    this.newCard.expirationDate = data.value;
  }

}
