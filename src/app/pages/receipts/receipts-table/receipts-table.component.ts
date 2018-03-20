import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../datamodels/receipt';
import * as _ from 'lodash';

@Component({
  selector: 'app-receipts-table',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss']
})
export class ReceiptsTableComponent implements OnInit {

  @Input() receiptList: Receipt[];

  filterInput = '';

  orderStatus = '';
  orderReceiptType = '';
  orderIDNumber = '';
  orderUserID = '';
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
   * Sorts the table depending on the property of the Card
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'status': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'receiptType': {
        newOrder = this.sortTableListHelper(this.orderReceiptType);
        this.orderReceiptType = newOrder;
        break;
      }
      case 'IDNumber': {
        newOrder = this.sortTableListHelper(this.orderIDNumber);
        this.orderIDNumber = newOrder;
        break;
      }
      case 'userID': {
        newOrder = this.sortTableListHelper(this.orderUserID);
        this.orderUserID = newOrder;
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

    if (newOrder) {
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


