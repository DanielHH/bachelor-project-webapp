import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {
  @Input() cardItem: Card;
  @Output() editItem = new EventEmitter<any>();

  cardTypeList: CardType[] = [];
  userList: User[] = [];

  showRequestModal = false;
  showReturnModal = false;

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService
  ) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() { }

  /**
   * Returns the name of the card type corresponding to the cardType
   */
  displayCardType() {
    if (this.cardItem && this.cardItem.cardType > 0) {
      const cardTypeToDisplay = _.find(this.cardTypeList, cardType =>
        cardType.id === this.cardItem.cardType);
      if (cardTypeToDisplay) {
        return cardTypeToDisplay.name;
      }
    }
    return '';
  }

  /**
   * Returns the name corresponding to the userID
   */
  displayUserName() {
    if (this.cardItem && this.cardItem.userID) {
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

  /**
   * Change route and send route data
   */
  route() {
    this.routeDataService.card.next(this.cardItem);
    this.router.navigate(['card-detail']);
  }

  /**
   * Set card to be outputted for editing
  */
  edit() {
    this.editItem.next(this.cardItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    const returnedStatus = 1;
    if (this.cardItem.status == returnedStatus) { // Don't change to ===, doesn't work
      this.showRequestModal = true;
    } else {
      this.showReturnModal = true;
    }
  }
}

