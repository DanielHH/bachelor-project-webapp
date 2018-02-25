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
  }

  /**
  * Submits a checkout
  */
  submitRequest() {
    this.setStatus(1); // TODO: ENUM/DATATYPE?
  }

  /**
  * Submits a checkin
  */
  submitReturn() {
    this.setStatus(0); // TODO: ENUM/DATATYPE?
  }

  /**
  * Inverts the card status active/inactive
  */
  setStatus(status: Number) { // TODO: ENUM/DATATYPE?
    this.cardItem.status = status;
  }

  /**
   * Returns a string representation of the expirationDate of the card
   */
  displayExpirationDate() {
    return moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

}
