import { Component, OnInit, Input } from '@angular/core';
import { LogEvent } from '../../../../datamodels/logEvent';
import * as _ from 'lodash';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss']
})
export class LogTableComponent implements OnInit {

  @Input() logEventList: LogEvent[];

  filterInput = '';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showRest = true;

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
