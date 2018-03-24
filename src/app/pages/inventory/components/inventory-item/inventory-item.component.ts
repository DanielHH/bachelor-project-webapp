import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { BaseItem } from '../../../../datamodels/baseItem';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  // @Input() cardItem: Card;
  @Input() baseItem: BaseItem;
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

  ngOnInit() {}

  /**
   * Change card status

  setCardStatus(status: number) {
    this.cardItem.status = status;
    this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
      if (res.message === 'success') {
        this.showRequestModal = false;
        this.showReturnModal = false;
      }
    });
  }*/

  /**
   * Returns the name of the card type corresponding to the cardType
   */
  displayCardType() {
    if (this.baseItem.item instanceof Card) {
      if (this.baseItem.getType() > 0) {
        const cardTypeToDisplay = _.find(
          this.cardTypeList,
          cardType => cardType.id === this.baseItem.getType()
        );
        if (cardTypeToDisplay) {
          return cardTypeToDisplay.name;
        }
      }
      return '';
    }
  }

  /**
   * Returns the name corresponding to the userID
   */
  displayUserName() {
    if (this.baseItem.getUserID()) {
      return _.find(this.userList, user => user.id === this.baseItem.getUserID())
        .name;
    }
    return '';
  }

    /**
   * Change route and send route data
   */
  route() {
    if (this.baseItem.item instanceof Card) {
      this.routeDataService.card.next(this.baseItem.item);
      this.router.navigate(['card-detail']);
    }
    /*if (this.baseItem.item instanceof Document) {
      this.routeDataService.document.next(this.baseItem.item);
      this.router.navigate(['document-detail']);
    }*/
  }

  /**
   * Set item to be outputted for editing
   */
  edit() {
    this.editItem.next(this.baseItem.item);
  }

  /**
   * Send a messge to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(): void {
    // TODO: implement me!
    return;
  }

  /**
   * Return a string representing when this item was last verified
   * to be in the inventory.
   */
  displayLastVerified(): string {
    // TODO: ask the backend
    return 'Aldrig';
  }
}
