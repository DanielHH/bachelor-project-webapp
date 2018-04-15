import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../../../../datamodels/user';
import { ModalService } from '../../../../services/modal.service';
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
    private modalService: ModalService
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
    this.modalService.returnCard.subscribe((card) => {
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

  ngOnInit() {
  }

  /**
   * Returns receipts from id
   * @param id Id of receipt
   */
  getReceipt(id: number) {
    return _.find(this.receipts, (receipt) => receipt.id == id);
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
      this.cardItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.cardItem.modifiedDate = this.utilitiesService.getLocalDate();


      // Update receipt
      const activeReceipt = this.getReceipt(this.cardItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      // Submit changes to server
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
    this.commentInput = '';
    this.returnForm.resetForm();

    this.cardItem = Object.assign({}, new Card());
    this.modalService.returnCard.next(this.cardItem);

    this.showModal = false;
  }

}
