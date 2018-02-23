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

  constructor() { }

  ngOnInit() {
    this.cardItem.displayedDate = moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

  /**
   * Submits a checkout
   */
  submitRequest() {
    this.flipStatus();
  }

  /**
   * Submits a checkin
   */
  submitReturn() {
    this.flipStatus();
  }

  /**
   * Flips the card status active/inactive
   */
  flipStatus() {
    if (this.cardItem.status === 1) {
      this.cardItem.status = 0;
    } else if (this.cardItem.status === 0) {
      this.cardItem.status = 1;
    }
    // this.cardItem.status = !this.cardItem.status;
  }

}
