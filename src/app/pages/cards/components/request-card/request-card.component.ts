import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Card } from '../../../../datamodels/card';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import { User } from '../../../../datamodels/user';
import { ModalService } from '../../../../services/modal.service';
import { Receipt } from '../../../../datamodels/receipt';
import * as moment from 'moment';
import { CardType } from '../../../../datamodels/cardType';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';

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

  usernameInput: any;
  locationInput = '';
  startDateInput = '';
  startDateDatepickerInput = '';
  commentInput = '';

  generatePDF = true;

  user: User;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService
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
    this.modalService.requestCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;

        this.startDateInput = utilitiesService.getDateString(utilitiesService.getLocalDate());
        this.startDateDatepickerInput = this.startDateInput;
        this.generatePDF = true;

        this._showModal = true;
        // Textarea size does not update correctly if there is no delay on assignment becuase the textarea scrollheight
        // is 0 until after 200ms~ becuase of modal?
        setTimeout(() => {
          this.commentInput = card.comment;
        }, 250);
      }
    });

    this.authService.user.subscribe(user => (this.user = user));
  }

  loading = false;

  hideSubmit = false;

  closeText = 'Avbryt';

  pdfView = false;

  pdfURL = '';

  ngOnInit() {}

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
    if (!this.startDateControl.hasError('required') && !this.startDateControl.hasError('startDate')) {
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
    return !this.usernameControl.hasError('required') && !this.usernameControl.hasError('username');
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
    return !this.startDateControl.hasError('required') && !this.startDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidUsername() && this.isValidLocation() && this.isValidStartDate();
  }

  /**
   * Update requested card, create receipt and submit to database.
   */
  requestCard() {
    if (this.isValidInput()) {
      // Set card information
      this.cardItem.user = this.usernameInput;
      this.cardItem.location = this.locationInput;
      this.cardItem.status = this.utilitiesService.getStatusFromID(2); // TODO: ENUM FOR STATUS, 2 = Requested
      this.cardItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.cardItem.modifiedDate = this.utilitiesService.getLocalDate();
      this.cardItem.registrator = this.user.name;

      // Create new receipt
      const receipt = new Receipt();
      receipt.itemType = this.utilitiesService.getItemTypeFromID(1); // TODO: ENUM, 1 means card
      receipt.card = this.cardItem;
      receipt.document = null;
      receipt.user = this.cardItem.user;
      receipt.startDate = this.utilitiesService.getLocalDate();
      receipt.endDate = null;

      // Submit changes to database
      this.httpService.httpPost<Receipt>('addNewReceipt/', receipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          const newReceipt = receiptRes.data;

          this.cardItem.activeReceipt = Number(newReceipt.id);

          this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(cardRes => {
            if (cardRes.message === 'success') {
              if (this.generatePDF) {
                this.loading = true;
                this.hideSubmit = true;
                this.closeText = 'Stäng';

                this.httpService.httpPost<any>('genPDF', ['card', this.cardItem, newReceipt]).then(pdfRes => {
                  if (pdfRes.message === 'success') {
                    newReceipt.url = pdfRes.url;
                    this.loading = false;
                    this.pdfView = true;
                    this.pdfURL = newReceipt.url;
                    this.hideSubmit = true;
                  }
                });
              }

              // Update receipt list
              this.receipts.unshift(newReceipt);
              this.receipts = this.receipts.slice();
              this.dataService.receiptList.next(this.receipts);

              // Update card list
              this.dataService.cardList.next(this.cards);
              if (!this.generatePDF) {
                this.closeForm();
              }
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
    this.modalService.requestCard.next(this.cardItem);

    this.loading = false;
    this.hideSubmit = false;
    this.closeText = 'Avbryt';
    this.pdfView = false;
    this.pdfURL = '';

    this.showModal = false;
  }

  displayUser(user?: User) {
    return user ? user.username : '';
  }
}
