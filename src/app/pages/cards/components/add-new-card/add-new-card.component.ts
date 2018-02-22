import { Component, OnInit, Input, Directive } from '@angular/core';
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

  // ngModel variables
  cardTypeInput = '';
  cardNumberInput = '';
  usernameInput = '';
  // NOT USED NOW userInput = '';
  locationInput = '';
  expirationDateInput = '';
  commentInput = '';
  addCardHolder: Boolean = false;

  cardTypes = [
    'USB',
    'MicroSD',
    'Harddrive',
    'Chip',
  ];

  cardTypeDict = {
    'USB': 0,
    'MicroSD': 0,
    'Harddrive': 0,
    'Chip': 0
  };

  usernames = [
    'jenli414',
    'nikni459',
    'phibe092',
    'johli252',
    'davha914',
    'danhe178',
    'andlu984'
  ];

  /**
   * Dictionary with username as key and {userID, user} as value.
   */
  userDict = {
    'jenli414': {userID: 0, user: 'Jennifer Lindgren'},
    'nikni459': {userID: 0, user: 'Niklas Nilsson'},
    'phibe092': {userID: 0, user: 'Philip Bengtsson'},
    'johli252': {userID: 0, user: 'Johan Lind'},
    'davha914': {userID: 0, user: 'David Hasselquist'},
    'danhe178': {userID: 0, user: 'Daniel Herzegh'},
    'andlu984': {userID: 0, user: 'Andreas Lundquist'},
  };

  filteredCardTypes: Observable<any[]>;
  filteredUsernames: Observable<any[]>;

  // Form Controls
  cardTypeControl = new FormControl('', Validators.required);
  cardNumberControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  // NOT USED NOW userControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);

  filterCardTypes(str: string) {
    console.log(this.cardTypes.toString);
    return this.cardTypes.filter(cardType =>
      cardType.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  filterUsernames(str: string) {
    return this.usernames.filter(username =>
      username.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  constructor(private httpService: HttpService) {
    this.filteredCardTypes = this.cardTypeControl.valueChanges
      .pipe(
        startWith(''),
        map(cardType => cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice())
      );

    this.filteredUsernames = this.usernameControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterUsernames(val))
    );
  }

  ngOnInit() {
  }

  addNewCard() {
    this.httpService.httpPost<Card>('addNewCard/', this.newCard).then(data => {

      console.log(data);

    });
  }

  getCardTypeInputFontColor() {
    if (this.newCard.cardType != null) {
      return 'black';
    } else {
      return 'gray';
    }
  }

  getUsernameInputFontColor() {
    if (this.newCard.userID != null) {
      return 'black';
    } else {
      return 'gray';
    }
  }

  getExpirationDateInputFontColor() {
    if (this.newCard.expirationDate != null) {
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
    this.newCard.cardNumber = this.cardNumberInput;
  }

  setUsername(data: any) {
    if (this.usernames.includes(this.usernameInput)) {
      this.newCard.userID = this.userDict[this.usernameInput].userID;
      // this.userInput = this.userDict[this.usernameInput].user;
      // this.newCard.user = this.userDict[this.usernameInput].user;
    } else {
      this.newCard.userID = null;
    }
  }

  /*setUser(data: any) {
    this.newCard.user = this.userInput;
    this.usernameInput = '';
    this.newCard.userID = null;
  }*/

  setLocation(data: any) {
    this.newCard.location = this.locationInput;
  }

  setComment(data: any) {
    this.newCard.comment = this.commentInput;
  }

  setExpirationDate(data: any) {
    console.log(this.expirationDateInput);
    if (this.expirationDateControl.hasError('required') ||
      this.expirationDateControl.hasError('expirationDate')) {
      this.newCard.expirationDate = null;
    } else {
      this.newCard.expirationDate = new Date(this.expirationDateInput);
    }
  }

}
