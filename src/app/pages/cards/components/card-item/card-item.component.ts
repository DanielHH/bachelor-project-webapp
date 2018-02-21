import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input() cardItem: Card;
  @Input() filterInput: string;

  edit = false;

  constructor() { }

  ngOnInit() {
    this.cardItem.displayedDate = moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

  /**
   * Opens bar for checkin/checkout
   */
  openEditBar() {
    this.edit = true;
  }

  /**
   * Closes bar for checkin/checkout
   */
  closeEditBar() {
    this.edit = false;
  }

  /**
   * Submits a checkout
   */
  submitRequest() {
    this.flipStatus();
    this.closeEditBar();
  }

  /**
   * Submits a checkin
   */
  submitReturn() {
    this.flipStatus();
    this.closeEditBar();
  }

  /**
   * Flips the card status active/inactive
   */
  flipStatus() {
    this.cardItem.status = !this.cardItem.status;
  }

  /**
   * Simple filter function.
   * Tries to find any match.
   */
  matchFilter() {
    if (this.cardItem.cardNumber.indexOf(this.filterInput) === -1
        && this.cardItem.cardType.toString().indexOf(this.filterInput) === -1
        && this.cardItem.userID.toString().indexOf(this.filterInput) === -1
        && this.cardItem.comment.indexOf(this.filterInput) === -1
        && this.cardItem.location.indexOf(this.filterInput) === -1
        && this.cardItem.displayedDate.indexOf(this.filterInput) === -1) {
      return false;
    }
    return true;
  }

}
