import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LogEvent } from '../../../../datamodels/logEvent';
import { Document } from '../../../../datamodels/document';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-document-history-table',
  templateUrl: './document-history-table.component.html',
  styleUrls: ['./document-history-table.component.scss']
})
export class DocumentHistoryTableComponent implements OnInit {

  @Input() logEventList: LogEvent[];
  @Input() document: Document;

  filterInput = '';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showOther = true;

  constructor() { }

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after modifiedDate ascending
   */
  sortTableListStart() {
    this.logEventList = _.orderBy(this.logEventList, ['logDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the log
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'logDate': {
        newOrder = this.sortTableListHelper(this.orderLogDate);
        this.orderLogDate = newOrder;
        break;
      }
      case 'logType': {
        newOrder = this.sortTableListHelper(this.orderLogType);
        this.orderLogType = newOrder;
        property = 'logType.name';
        break;
      }
      case 'logText': {
        newOrder = this.sortTableListHelper(this.orderLogText);
        this.orderLogText = newOrder;
        break;
      }
      case 'user': {
        newOrder = this.sortTableListHelper(this.orderLogUser);
        this.orderLogUser = newOrder;
        property = 'user.name';
        break;
      }
    }

    if (newOrder) {
      this.logEventList = _.orderBy(this.logEventList, [property], [newOrder]);
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
