import { Component, OnInit, Input, Output, ViewChild } from "@angular/core";
import { Card } from "../../../../datamodels/card";
import { HttpService } from "../../../../services/http.service";
import { FormControl, Validators, NgForm } from "@angular/forms";
import { User } from "../../../../datamodels/user";
import { ReturnService } from "../../../../services/return.service";
import { DataService } from "../../../../services/data.service";
import { Receipt } from "../../../../datamodels/receipt";
import * as _ from "lodash";
import { UtilitiesService } from "../../../../services/utilities.service";
import { LogEvent } from "../../../../datamodels/logEvent";

@Component({
  selector: "app-return-card",
  templateUrl: './return-card.component.html',
  styleUrls: ['./return-card.component.scss']
})
export class ReturnCardComponent implements OnInit {
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

  cards: Card[] = [];
  receipts: Receipt[] = [];

  cardItem: Card = null;

  locationControl = new FormControl('', Validators.required);

  locationInput = '';
  commentInput = '';

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private returnService: ReturnService
  ) {
    // Receipt list subscriber
    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Card list subscriber
    this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });

    // Return card subscriber
    this.returnService.card.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;

        this.commentInput = this.cardItem.comment;

        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

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
      // Set card information
      this.cardItem.user = new User();
      this.cardItem.location = this.locationInput;
      this.cardItem.status = this.utilitiesService.getStatusFromID(1); // TODO: ENUM FOR STATUS, 1 = Returned
      this.cardItem.comment =
        this.commentInput != '' ? this.commentInput : null;
      this.cardItem.modifiedDate = this.utilitiesService.getLocalDate();

      console.log(this.cardItem);

      // Update receipt
      const activeReceipt = this.getReceipt(this.cardItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      // Create new log event
      const logEvent = new LogEvent();
      logEvent.itemTypeID = 1; // TODO: ENUM, 1 means card
      logEvent.logTypeID = 2; // TODO: ENUM, 1 means 'returning card'
      logEvent.cardID = this.cardItem.id;
      logEvent.logDate = this.cardItem.modifiedDate;

      // Submit changes to server
      this.httpService
        .httpPost<LogEvent>('addNewLogEvent/', logEvent)
        .then(logEventRes => {
          if (logEventRes.message === 'success') {

            this.httpService
              .httpPut<Receipt>('updateReceipt/', activeReceipt)
              .then(receiptRes => {
                console.log(receiptRes);
                if (receiptRes.message === 'success') {
                  this.cardItem.activeReceipt = null;

                  this.httpService
                    .httpPut<Card>('updateCard/', this.cardItem)
                    .then(cardRes => {
                      if (cardRes.message === 'success') {
                        // Update receipt list
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
        });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.commentInput = null;
    this.returnForm.resetForm();

    this.cardItem = Object.assign({}, new Card());
    this.returnService.card.next(this.cardItem);

    this.showModal = false;
  }

  displayExpirationDate() {
    if (this.cardItem) {
      return this.utilitiesService.getDateString(this.cardItem.expirationDate);
    }
  }
}
