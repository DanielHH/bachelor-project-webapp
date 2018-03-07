import { Component, OnInit, Input, Directive, Inject } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-modify-card',
  templateUrl: './modify-card.component.html',
  styleUrls: ['./modify-card.component.scss']
})
export class ModifyCardComponent implements OnInit {
  // Form variables
  cardTypeInput = '';
  cardNumberInput = '';
  locationInput = '';
  expirationDateInput = '';
  expirationDateDatepickerInput = '';
  commentInput = '';
  addCardHolder: Boolean = false;
  usernameInput = '';

  // Form Controls
  cardTypeControl = new FormControl('', Validators.required);
  cardNumberControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);
  expirationDatePickerControl = new FormControl();

  // Database data lists
  cardTypes = [];
  users = [];

  // Filtered lists
  filteredCardTypes: Observable<any[]> = this.cardTypeControl.valueChanges.pipe(
    startWith(''),
    map(
      cardType =>
        cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice()
    )
  );

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges.pipe(
    startWith(''),
    map(val => this.filterUsers(val))
  );

  @Input() cardList: Card[];

  /**
   * Set form to display card.
   */
  @Input('card') set card(card: Card) {
    if (card) {
      this.cardTypeInput = _.find(this.cardTypes, (docType) => docType.id === card.cardType).name;
      this.cardNumberInput = card.cardNumber;
      this.expirationDateInput = moment(card.expirationDate).format('YYYY-MM-DD');
      this.expirationDateDatepickerInput = this.expirationDateInput;
      this.locationInput = card.location;
      this.commentInput = card.comment;
      if (card.userID != null) {
        this.usernameInput = _.find(this.users, (user) => user.id === card.userID).username;
        this.addCardHolder = true;
      } else {
        this.usernameInput = '';
        this.addCardHolder = false;
      }
    }
  }

  constructor(
    private httpService: HttpService,
    public dataService: DataService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataService.cardTypeList.subscribe(cardTypes => {
      this.cardTypes = cardTypes;
      this.cardTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });
  }

  ngOnInit() {}

  /**
   * Filters list of cardTypes based on cardType input
   * @param str cardType input
   */
  filterCardTypes(str: string) {
    return this.cardTypes.filter(
      cardType =>
        str != null &&
        cardType.name.toLowerCase().indexOf(str.toLowerCase()) === 0
    );
  }

  /**
   * Filters list of usernames based on username input
   * @param str username input
   */
  filterUsers(str: string) {
    return this.users.filter(
      user =>
        str != null &&
        user.username.toLowerCase().indexOf(str.toLowerCase()) === 0
    );
  }

  /**
   * Attempts to submit new card to database
   */
  addNewCard(): Promise<any> {
    return new Promise(resolve => {

      if (this.isValidInput()) {
        const newCard = new Card();

        newCard.cardType = this.getCardTypeID(this.cardTypeInput);
        newCard.cardNumber = this.cardNumberInput;
        newCard.location = this.locationInput;
        newCard.expirationDate = new Date(this.expirationDateInput);
        newCard.creationDate = this.utilitiesService.getLocalDate();
        newCard.modifiedDate = this.utilitiesService.getLocalDate();
        newCard.comment = this.commentInput;
        newCard.status = 1;

        if (this.addCardHolder && this.isValidUsername()) {
          newCard.userID = this.getUserID(this.usernameInput);
        } else {
          newCard.userID = null;
        }

        this.httpService.httpPost<Card>('addNewCard/', newCard).then(res => {
          if (res.message === 'success') {
            this.cardList.unshift(res.data);
            this.dataService.cardList.next(this.cardList);

            this.resetForm();
            resolve();
          }
        });
      }
    });
  }

  /**
   * Attempts to submit edited card to database
   */
  editCard(card: Card): Promise<any> {
    return new Promise(resolve => {

      if (this.isValidInput()) {
        card.cardType = this.getCardTypeID(this.cardTypeInput);
        card.cardNumber = this.cardNumberInput;
        card.location = this.locationInput;
        card.expirationDate = new Date(this.expirationDateInput);
        card.creationDate = this.utilitiesService.getLocalDate();
        card.modifiedDate = this.utilitiesService.getLocalDate();
        card.comment = this.commentInput;

        if (this.addCardHolder && this.isValidUsername()) {
          card.userID = this.getUserID(this.usernameInput);
        } else {
          card.userID = null;
        }

        this.httpService.httpPut<Card>('updateCard/', card).then(res => {
          if (res.message === 'success') {
            this.dataService.cardList.next(this.cardList);

            this.resetForm();
            resolve();
          }
        });
      }
    });
  }

  /**
   * Returns the id associated with cardTypeName
   * @param cardTypeName Name of card type
   */
  getCardTypeID(cardTypeName: String) {
    return _.find(this.cardTypes, cardType => cardType.name === cardTypeName)
      .id;
  }

  /**
   * Returns user id of user with username
   * @param username Username of user
   */
  getUserID(username: String) {
    return _.find(this.users, user => user.username === username).id;
  }

  /**
   * Sets the datePicker the date entered in the input field.
   */
  setExpirationDateToDatePicker() {
    if (
      !this.expirationDateControl.hasError('required') &&
      !this.expirationDateControl.hasError('expirationDate')
    ) {
      this.expirationDateDatepickerInput = this.expirationDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets expirationDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setExpirationDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.expirationDateInput = moment(data.value).format('YYYY-MM-DD');
    }
  }

  /**
   * Returns true if entered card type is valid, else false.
   */
  isValidCardType() {
    return (
      !this.cardTypeControl.hasError('required') &&
      !this.cardTypeControl.hasError('cardType')
    );
  }

  /**
   * Returns true if entered card number is valid, else false.
   */
  isValidCardNumber() {
    return !this.cardNumberControl.hasError('required');
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return (
      !this.addCardHolder ||
      (!this.usernameControl.hasError('required') &&
        !this.usernameControl.hasError('username'))
    );
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered expiration date is valid, else false.
   */
  isValidExpirationDate() {
    return !this.expirationDateControl.hasError('required') &&
    !this.expirationDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidCardType() &&
      this.isValidCardNumber() &&
      this.isValidUsername() &&
      this.isValidLocation() &&
      this.isValidExpirationDate()
    );
  }

  /**
   * Resets form by resetting form controls and clearing inputs
   */
  resetForm() {
    this.cardTypeControl.reset();
    this.cardNumberControl.reset();
    this.usernameControl.reset();
    this.locationControl.reset();
    this.expirationDateControl.reset();
    this.expirationDatePickerControl.reset();
    this.commentInput = '';
  }
}
