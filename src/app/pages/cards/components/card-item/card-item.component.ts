import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { User } from '../../../../datamodels/user';

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
    this.dataService.cardTypeList.subscribe( (cardTypeList) => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.userList.subscribe( (userList) => {
      this.userList = userList;
    });
  }

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

  displayCardType() {
    return this.cardTypeList[this.cardItem.cardType - 1].name;
  }

  displayUserName() {
    const name = this.userList[this.cardItem.userID - 1].name;
    if (!name) {
      return '';
    }
    return name;
  }

  /**
   * Returns a string representation of the expirationDate of the card
   */
  displayExpirationDate() {
    return moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

}
