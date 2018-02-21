import { Component, OnInit, Input, Directive } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Directive({
  selector: '[appCardType]',
  providers: [{provide: NG_VALIDATORS, useExisting: CardTypeValidatorDirective, multi: true}]
 })
 export class CardTypeValidatorDirective implements Validator {

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const cardTypes = [
      'Type 1',
      'Type 2',
      'Type 3',
      'Type 4',
    ];
    const isValid = input && cardTypes.includes(input);
    const message = {
      'cardType': {
        'message': 'Invalid card type'
      }
    };
    return isValid ? null : message;
  }
 }

 @Directive({
  selector: '[appUserID]',
  providers: [{provide: NG_VALIDATORS, useExisting: UserIDValidatorDirective, multi: true}]
 })
 export class UserIDValidatorDirective implements Validator {

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const userIDs = [
      'Jennifer',
      'Niklas',
      'Philip',
      'Johan',
      'David',
      'Daniel',
      'Andreas'
    ];
    const isValid = input && userIDs.includes(input);
    const message = {
      'userID': {
        'message': 'Invalid user ID'
      }
    };
    return isValid ? null : message;
  }
 }

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  newCard = new Card();

  // ngModel variables
  cardTypeInput = '';
  cardNumberInput = '';
  userIDInput = '';
  userInput = '';
  locationInput = '';
  expirationDateInput = '';
  commentInput = '';

  cardTypes = [
    'Type 1',
    'Type 2',
    'Type 3',
    'Type 4',
  ];

  cardTypeDict = {
    'Type 1': 0,
    'Type 2': 1,
    'Type 3': 2,
    'Type 4': 3,
    'Type 5': 4,
  };

  userIDs = [
    'Jennifer',
    'Niklas',
    'Philip',
    'Johan',
    'David',
    'Daniel',
    'Andreas'
  ];

  userIDDict = {
    'Jennifer': 0,
    'Niklas': 1,
    'Philip': 2,
    'Johan': 3,
    'David': 4,
    'Daniel': 4,
    'Andreas': 4,
  };

  filteredCardTypes: Observable<any[]>;
  filteredUserIDs: Observable<any[]>;

  // Form Controls
  cardTypeControl = new FormControl('', [Validators.required]);
  cardNumberControl = new FormControl('', Validators.required);
  userIDControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);

  filterCardTypes(str: string) {
    console.log(this.cardTypes.toString);
    return this.cardTypes.filter(cardType =>
      cardType.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  /*filterUserIDs(str: string) {
    return this.userIDs.filter(userID =>
      userID.name.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }*/

  constructor(private httpService: HttpService) {
    this.filteredCardTypes = this.cardTypeControl.valueChanges
      .pipe(
        startWith(''),
        map(cardType => cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice())
      );

    /*this.filteredUserIDs = this.userIDControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUserIDs(val))
      );*/
  }

  ngOnInit() {
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
    if (this.cardTypes.includes(this.cardTypeInput)) {
      this.newCard.cardType = this.cardTypeDict[this.cardTypeInput];
    } else {
      this.newCard.cardType = null;
    }
  }

  setCardNumber(data: any) {
    this.newCard.cardNumber = data.data;
  }

  setUserID(data: any) {
    if (this.userIDs.includes(this.userIDInput)) {
      this.newCard.userID = this.userIDDict[this.userIDInput];
    } else {
      this.newCard.userID = null;
    }
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
