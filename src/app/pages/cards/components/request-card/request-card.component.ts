import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { RequestService } from '../../../../services/request.service';
import { Receipt } from '../../../../datamodels/receipt';
import { UtilitiesService } from '../../../../services/utilities.service';
import { User } from '../../../../datamodels/user';
import * as moment from 'moment';
import { CardType } from '../../../../datamodels/cardType';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  cardItem: Card = null; // Card that is requested

  showModal = false;

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }
    this.showModal = value;
  }

  users: User[] = [];
  cards: Card[] = [];
  receipts: Receipt[] = [];

  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  startDateControl = new FormControl('', Validators.required);

  usernameInput = '';
  locationInput = '';
  startDateInput = '';
  startDateDatepickerInput = '';
  commentInput = '';

  generatePDF = true;

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges.pipe(
    startWith(''),
    map(val => this.filterUsers(val))
  );

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private requestService: RequestService
  ) {
    // User list subscriber
    this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    // Receipt list subscriber
    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Card list subscriber
    this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });

    // Request card subscriber
    this.requestService.card.subscribe((card) => {
      if (card && card.id) {
        this.cardItem = card;

        this.startDateInput = utilitiesService.getDateString(utilitiesService.getLocalDate());
        this.startDateDatepickerInput = this.startDateInput;
        this.commentInput = this.cardItem.comment;
        this.generatePDF = true;

        this._showModal = true;

      }
    });
  }

  ngOnInit() {
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
   * Returns user id of user with username
   * @param username Username of user
   */
  getUserID(username: String) {
    return _.find(this.users, user => user.username === username).id;
  }

  /**
   * Sets the start date datePicker the date entered in the input field.
   */
  setStartDateToDatePicker() {
    if (
      !this.startDateControl.hasError('required') &&
      !this.startDateControl.hasError('startDate')
    ) {
      this.startDateDatepickerInput = this.startDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets start date from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setStartDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.startDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return (
      !this.usernameControl.hasError('required') &&
      !this.usernameControl.hasError('username')
    );
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered start date is valid, else false.
   */
  isValidStartDate() {
    return !this.startDateControl.hasError('required') &&
      !this.startDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidUsername() &&
      this.isValidLocation() &&
      this.isValidStartDate()
    );
  }

  /**
   * Update requested card, create receipt and submit to database.
   */
  requestCard() {
    if (this.isValidInput()) {
      // Set card information
      this.cardItem.userID = this.getUserID(this.usernameInput);
      this.cardItem.location = this.locationInput;
      this.cardItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.cardItem.status = 2; // TODO: ENUM FOR STATUS, 2 = Requested
      this.cardItem.modifiedDate = this.utilitiesService.getLocalDate();

      // Create new receipt
      const receipt = new Receipt();
      receipt.itemTypeID = 1; // TODO: ENUM, 1 means card
      receipt.cardID = this.cardItem.id;
      receipt.userID = this.cardItem.userID;
      receipt.startDate = new Date(this.startDateInput);

      // Submit changes to database
      this.httpService.httpPost<Receipt>('addNewReceipt/', receipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          this.cardItem.activeReceipt = receiptRes.data.id;

          this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(cardRes => {
            if (cardRes.message === 'success') {
              // Update receipt list
              this.receipts.unshift(receiptRes.data);
              this.receipts = this.receipts.slice();
              this.dataService.receiptList.next(this.receipts);

              // Update card list
              this.dataService.cardList.next(this.cards);

              this.showModal = false;
            }
          });
        }
      });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.usernameControl.reset();
    this.locationControl.reset();
    this.requestForm.resetForm();

    this.cardItem = Object.assign({}, new Card());
    this.requestService.card.next(this.cardItem);

    this.showModal = false;
  }

}
