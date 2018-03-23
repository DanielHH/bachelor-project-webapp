import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { ReturnService } from '../../../../services/return.service';
import { DataService } from '../../../../services/data.service';
import { Receipt } from '../../../../datamodels/receipt';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-return-card',
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

    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });

    this.returnService.card.subscribe((card) => {
      if (card && card.id) {
        this.cardItem = card;

        this.commentInput = this.cardItem.comment;

        this._showModal = true;

      }
    });
  }

  ngOnInit() {
  }

  /**
   * Returns receipts from id
   * @param id Id of receipt
   */
  getReceipt(id: number) {
    return _.find(this.receipts, (receipt) => receipt.id === id);
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
      this.cardItem.userID = null;
      this.cardItem.location = this.locationInput;
      this.cardItem.status = 1; // TODO: ENUM FOR STATUS, 1 = Returned

      const activeReceipt = this.getReceipt(this.cardItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      this.httpService.httpPut<Receipt>('updateReceipt/', activeReceipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          this.cardItem.activeReceipt = null;

          this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(cardRes => {
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
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.returnForm.resetForm();
    this.commentInput = null;

    this.cardItem = Object.assign({}, new Card());
    this.returnService.card.next(this.cardItem);

    this.showModal = false;
  }

}
