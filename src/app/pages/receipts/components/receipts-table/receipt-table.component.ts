import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../../datamodels/receipt';
import * as _ from 'lodash';

@Component({
  selector: 'app-receipt-table',
  templateUrl: './receipt-table.component.html',
  styleUrls: ['./receipt-table.component.scss']
})
export class ReceiptTableComponent implements OnInit {

  @Input() receiptList: Receipt[];

  filterInput = '';

  orderStatus = '';
  orderItemType = '';
  orderIDNumber = '';
  orderUser = '';
  orderStartDate = '';
  orderEndDate = '';

  showCard = true;
  showDocument = true;
  showActive = true;
  showInactive = false;


  constructor() { }

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after startDate ascending
   */
  sortTableListStart() {
    this.receiptList = _.orderBy(this.receiptList, ['startDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the receipt
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'TODO': { // ACTIVE/INACTIVE
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'TODO': { // ITEM TYPE
        newOrder = this.sortTableListHelper(this.orderItemType);
        this.orderItemType = newOrder;
        break;
      }
      case 'TODO': { // ITEM NUMBER/NAME
        newOrder = this.sortTableListHelper(this.orderIDNumber);
        this.orderIDNumber = newOrder;
        break;
      }
      case 'user.name': {
        newOrder = this.sortTableListHelper(this.orderUser);
        this.orderUser = newOrder;
        break;
      }
      case 'startDate': {
        newOrder = this.sortTableListHelper(this.orderStartDate);
        this.orderStartDate = newOrder;
        break;
      }
      case 'endDate': {
        newOrder = this.sortTableListHelper(this.orderEndDate);
        this.orderEndDate = newOrder;
        break;
      }
    }

    if (newOrder && property === 'IDNumber') {
      this.receiptList = _.orderBy(this.receiptList, ['cardID'], [newOrder]);
      this.receiptList = _.orderBy(this.receiptList, ['documentID'], [newOrder]);
    } else if (newOrder) {
      this.receiptList = _.orderBy(this.receiptList, [property], [newOrder]);
    }

  }

  /**
   * Sets the order to sort by
   * @param order
  */
  sortTableListHelper(order: string) {
    switch (order) {
      case 'asc': return 'desc';
      default: return 'asc';
    }
  }

}


