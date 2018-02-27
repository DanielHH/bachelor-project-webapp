import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {
  @Input() cardItem: Card;

  cardTypeList: CardType[] = [];
  userList: User[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {}

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
  setStatus(status: Number) {
    // TODO: ENUM/DATATYPE?
    this.cardItem.status = status;
  }

  displayCardType() {
    if (this.cardItem.cardType > 0) {
      const test = _.find( this.cardTypeList, cardType => cardType.id === this.cardItem.cardType);
      console.log(test);
      if (test) {
        return test.name;
      }
    }
    return '';
  }

  displayUserName() {
    if (this.cardItem.userID) {
      return _.find(this.userList, user => user.id === this.cardItem.userID)
        .name;
    }
    return '';
  }

  /**
   * Returns a string representation of the expirationDate of the card
   */
  displayExpirationDate() {
    return moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }
}
