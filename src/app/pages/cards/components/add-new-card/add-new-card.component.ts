import { Component, OnInit, Input, Directive, Inject } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  newCard = new Card();

  // Form variables
  cardTypeInput = '';
  cardNumberInput = '';
  locationInput = '';
  expirationDateInput = '';
  expirationDateDatepickerInput = '';
  addCardHolder: Boolean = false;
  commentInput = '';
  usernameInput = '';

  // Database data
  cardTypes = [];
  users = [];

  // Form Controls
  cardTypeControl = new FormControl('', Validators.required);
  cardNumberControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);
  expirationDatePickerControl = new FormControl();

  // Filtered lists
  filteredCardTypes: Observable<any[]> = this.cardTypeControl.valueChanges
  .pipe(
    startWith(''),
    map(cardType => cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice())
  );

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges
    .pipe(
      startWith(''),
      map(val => this.filterUsers(val))
  );

  constructor(public dialogRef: MatDialogRef<AddNewCardComponent>,
      private httpService: HttpService, public dataService: DataService) {

    // Get cardTypes from database
    this.dataService.cardTypeList.subscribe( (cardTypes) => {
      this.cardTypes = cardTypes;
    });

    // Get users from database
    this.dataService.userList.subscribe( (users) => {
      this.users = users;
    });
  }

  ngOnInit() {
  }

  /**
   * Close modal for addNewCard
  */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Filters list of cardTypes based on cardType input
   * @param str cardType input
   */
  filterCardTypes(str: string) {
    console.log(this.cardTypes.toString);
    return this.cardTypes.filter(cardType =>
      cardType.name.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  /**
   * Filters list of usernames based on username input
   * @param str username input
   */
  filterUsers(str: string) {
    return this.users.filter(user =>
      user.username.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  /**
   * Submit new card to database if ok
  */
  addNewCard() {
    if (this.isValidNewCard()) {
      this.httpService.httpPost<Card>('addNewCard/', this.newCard).then(res => {
        console.log(res.data);
      });
    }
  }

  /**
   * Set cardType in newCard to selected cardNumber in input field.
   */
  setCardType() {
    if (this.isValidCardType()) {
      this.newCard.cardType = this.getCardTypeID(this.cardTypeInput);
    } else {
      this.newCard.cardType = null;
    }
  }

  /**
   * Returns the id associated with cardTypeName
   * @param cardTypeName Name of card type
   */
  getCardTypeID(cardTypeName: String) {
    return _.find(this.cardTypes, (cardType) => cardType.name === cardTypeName).id;
  }

  /**
   * Set cardNumber in newCard to cardNumber in input field.
   */
  setCardNumber() {
    if (this.isValidCardNumber()) {
      this.newCard.cardNumber = this.cardNumberInput;
    } else {
      this.newCard.cardNumber = null;
    }
  }

  /**
   * Set userID in newCard to userID associated with username in input field.
   */
  setUserID() {
    if (this.isValidUsername()) {
      this.newCard.userID = this.getUserID(this.usernameInput);
    } else {
      this.newCard.userID = null;
    }
  }

  /**
   * Returns user id of user with username
   * @param username Username of user
   */
  getUserID(username: String) {
    return _.find(this.users, (user) => user.username === username).id;
  }

  /**
   * Set location in newCard to location in input field.
   */
  setLocation() {
    if (this.isValidLocation()) {
      this.newCard.location = this.locationInput;
    } else {
      this.newCard.location = null;
    }
  }

  /**
   * Set comment in newCard to comment in input field.
   */
  setComment(data: any) {
    this.newCard.comment = this.commentInput;
  }

  /**
   * Sets expirationDate from input field if the form control has no errors.
   * Also sets the datePicker to that date.
  */
  setExpirationDateFromInput() {
    if (this.expirationDateControl.hasError('required') || this.expirationDateControl.hasError('expirationDate')) {
      this.newCard.expirationDate = null;
    } else {
      this.expirationDateDatepickerInput = this.expirationDateInput; // Set date in Datepicker
      this.newCard.expirationDate = new Date(this.expirationDateInput);
    }
  }

  /**
   * Sets expirationDate from datePicker to visible expirationDateInput field
   * and to expirationDate field in card.
   * @param data Date selected in datePicker
   */
  setExpirationDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.expirationDateInput = moment(data.value).format('YYYY-MM-DD');
      this.newCard.expirationDate = new Date(this.expirationDateInput);
    }
  }

  /**
   * Returns true if entered card type is valid, else false.
  */
  isValidCardType() {
    return !this.cardTypeControl.hasError('required') && !this.cardTypeControl.hasError('cardType');
  }

  /**
   * Returns true if entered card number is valid, else false.
  */
  isValidCardNumber() {
    return !this.cardNumberControl.hasError('required');
  }

  /**
   * Returns true if entered card number is valid, else false.
  */
  isValidUsername() {
    if (this.addCardHolder) {
      return !this.usernameControl.hasError('required') && !this.usernameControl.hasError('username');
    } else {
      return this.newCard.userID == null;
    }
  }

  /**
   * Returns true if entered location is valid, else false.
  */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered location is valid, else false.
  */
  isValidExpirationDate() {
    return !this.expirationDateControl.hasError('required') && !this.expirationDateControl.hasError('expirationDate');
  }

  /**
   * Returns true if newCard is ready to be submitted to database, else false
  */
  isValidNewCard() {
    return this.isValidCardType() && this.isValidCardNumber() &&
    this.isValidUsername() && this.isValidLocation() && this.isValidExpirationDate();
  }

}
