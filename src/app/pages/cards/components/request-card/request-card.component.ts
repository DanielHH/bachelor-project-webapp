import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from '../../../../auth/auth.service';
import { Card } from '../../../../datamodels/card';
import { LogEvent } from '../../../../datamodels/logEvent';
import { Receipt } from '../../../../datamodels/receipt';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent implements OnInit, OnDestroy {
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

  user: User;
  users: User[] = [];
  cards: Card[] = [];
  receipts: Receipt[] = [];
  logEvents: LogEvent[] = [];

  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  startDateControl = new FormControl('', Validators.required);

  usernameInput: any;
  locationInput = '';
  startDateInput = '';
  startDateDatepickerInput = '';
  commentInput = '';

  generatePDF = true;

  loading = false;

  hideSubmit = false;

  closeText = 'Avbryt';

  pdfView = false;

  pdfURL = '';

  authServiceSubscriber: any;

  dataServiceUserSubscriber: any;

  dataServiceReceiptSubscriber: any;

  dataServiceCardSubscriber: any;

  dataServiceLogEventSubscriber: any;

  modalServiceSubscriber: any;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    // User list subscriber
    this.dataServiceUserSubscriber = this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    // Receipt list subscriber
    this.dataServiceReceiptSubscriber = this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Card list subscriber
    this.dataServiceCardSubscriber = this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });

    // LogEvent list subscriber
    this.dataServiceLogEventSubscriber = this.dataService.logEventList.subscribe(logEvents => {
      this.logEvents = logEvents;
    });

    // Request card subscriber
    this.modalServiceSubscriber = this.modalService.requestCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;

        this.startDateInput = utilitiesService.getDateString(new Date());
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
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.requestCard.next(null);

    this.authServiceSubscriber.unsubscribe();

    this.dataServiceUserSubscriber.unsubscribe();

    this.dataServiceReceiptSubscriber.unsubscribe();

    this.dataServiceCardSubscriber.unsubscribe();

    this.dataServiceLogEventSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
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
      this.cardItem.status = this.utilitiesService.getStatusFromID(2); // 2 = Requested
      this.cardItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.cardItem.modifiedDate = new Date();
      this.cardItem.registrator = this.user.name;

      // Create new receipt
      const receipt = new Receipt();
      receipt.itemType = this.utilitiesService.getItemTypeFromID(1); // 1 means card
      receipt.card = this.cardItem;
      receipt.document = null;
      receipt.user = this.cardItem.user;
      receipt.startDate = new Date(this.startDateInput);
      receipt.endDate = null;

      // Create new log event
      const logText = this.cardItem.cardNumber + ' till ' + this.cardItem.user.name;
      const logEvent = this.utilitiesService.
      createNewLogEventForItem(1, 2, this.cardItem, this.user, logText); // 1 = Card, 2 = Request

      this.httpService
        .httpPost<Receipt>('addNewReceipt/', {receipt: receipt, logEvent: logEvent})
        .then(res => {
          if (res.message === 'success') {
            const newReceipt = res.data.receipt;

            this.cardItem.activeReceiptID = Number(newReceipt.id);

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
                  this.closeText = 'Avbryt';
                  this.updateLists(res.data.logEvent, newReceipt);
                }
              });
            } else {
              this.updateLists(res.data.logEvent, newReceipt);
              this.closeForm();
            }
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

  displayExpirationDate() {
    if (this.cardItem) {
      return this.utilitiesService.getDateString(this.cardItem.expirationDate);
    }
  }

  updateLists(logEvent: any, receipt: any) {
    // Update log event list
    this.utilitiesService.updateLogEventList(logEvent);

    // Update receipt list
    this.receipts.unshift(receipt);
    this.receipts = this.receipts.slice();
    this.dataService.receiptList.next(this.receipts);

    // Update card list
    this.dataService.cardList.next(this.cards);
  }
}
