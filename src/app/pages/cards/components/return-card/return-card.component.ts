import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
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
  selector: 'app-return-card',
  templateUrl: './return-card.component.html',
  styleUrls: ['./return-card.component.scss']
})
export class ReturnCardComponent implements OnInit, OnDestroy {
  @ViewChild('returnForm') returnForm: NgForm;

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
  cards: Card[] = [];
  receipts: Receipt[] = [];
  logEvents: LogEvent[] = [];

  cardItem: Card = null;

  latestUser: User = null;

  locationControl = new FormControl('', Validators.required);

  locationInput = '';
  commentInput = '';

  authServiceSubscriber: any;

  dataServiceReceiptSubscriber: any;

  dataServiceCardSubscriber: any;

  dataServiceLogEventSubscriber: any;

  modalServiceSubscriber: any;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    // Receipt list subscriber
    this.dataServiceReceiptSubscriber = this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Card list subscriber
    this.dataServiceCardSubscriber = this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });

    // Log event list subscriber
    this.dataServiceLogEventSubscriber = this.dataService.logEventList.subscribe(logEvents => {
      this.logEvents = logEvents;
    });

    // Return card subscriber
    this.modalServiceSubscriber = this.modalService.returnCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;

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
    this.modalService.returnCard.next(null);

    this.authServiceSubscriber.unsubscribe();

    this.dataServiceReceiptSubscriber.unsubscribe();

    this.dataServiceCardSubscriber.unsubscribe();

    this.dataServiceLogEventSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Returns receipts from id
   * @param id Id of receipt
   */
  getReceipt(id: number) {
    return _.find(this.receipts, receipt => receipt.id == id);
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Change status of a card to returned and update receipt
   */
  returnCard() {
    if (this.isValidLocation()) {
      // Save latestUser for LogEvent
      this.latestUser = this.cardItem.user;
      // Set card information
      this.cardItem.user = new User();
      this.cardItem.location = this.locationInput;
      this.cardItem.status = this.utilitiesService.getStatusFromID(1); // TODO: ENUM FOR STATUS, 1 = Returned
      this.cardItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.cardItem.modifiedDate = this.utilitiesService.getLocalDate();

      // Update receipt
      const activeReceipt = this.getReceipt(this.cardItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      // Create new log event
      const logText = this.cardItem.cardNumber + ' från ' + this.latestUser.name;
      const logEvent = this.utilitiesService.
      createNewLogEventForItem(1, 1, this.cardItem, this.user, logText); // TODO: 1 = Card, 1 = Return

      // Submit changes to server
      this.httpService
        .httpPut<Receipt>('updateReceipt/', {
          receipt: activeReceipt,
          logEvent: logEvent,
          card: this.cardItem
        })
        .then(res => {
          if (res.message === 'success') {
            this.cardItem.activeReceipt = null;
            // Update log event list
            this.utilitiesService.updateLogEventList(res.data.logEvent);

            // Update receipt list
            this.receipts = this.receipts.slice();
            this.dataService.receiptList.next(this.receipts);

            // Update card list
            this.dataService.cardList.next(this.cards);

            this.closeForm();
          }
        });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.commentInput = '';
    this.returnForm.resetForm();

    this.cardItem = Object.assign({}, new Card());
    this.modalService.returnCard.next(this.cardItem);

    this.showModal = false;
  }
}
