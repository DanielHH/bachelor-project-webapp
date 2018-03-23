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
import { EditService } from '../../../../services/edit.service';
import { RequestService } from '../../../../services/request.service';
import { ReturnService } from '../../../../services/return.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {
  @Input() cardItem: Card;

  cardTypeList: CardType[] = [];
  userList: User[] = [];

  showRequestModal = false;
  showReturnModal = false;

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private editService: EditService,
    private requestService: RequestService,
    private returnService: ReturnService) {

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
    this.editService.card.next(this.cardItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    const returnedStatus = 1;
    if (this.cardItem.status == returnedStatus) { // Don't change to ===, doesn't work
      this.requestService.card.next(this.cardItem);
    } else {
      this.returnService.card.next(this.cardItem);
    }
  }

  /**
   * Sets the status of the card in the database
   */
  editStatus() {
    this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
      if (res.message === 'success') { }
    });
  }
}

