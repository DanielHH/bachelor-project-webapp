import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { LogEvent } from '../../../../datamodels/logEvent';
import { lowerCase } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss']
})
export class LogTableComponent implements OnInit, OnDestroy {

  filterInput = '';

  order = 'desc';
  sortProperty = 'logDate';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showOther = true;

  dataServiceSubscriber: any;

  logEventList: LogEvent[] = [];

  constructor(private dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
      this.orderTableList();
    });
  }

  ngOnInit() {
    this.orderTableList();
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }

  /**
   * Update order and order property
   * @param property
   */
  updateOrder(property: string) {

    switch (property) {
      case 'logDate': {
        this.order = this.getNewOrder(this.orderLogDate);
        this.orderLogDate = this.order;
        break;
      }
      case 'logType': {
        this.order = this.getNewOrder(this.orderLogType);
        this.orderLogType = this.order;
        property = 'logType.name';
        break;
      }
      case 'logText': {
        this.order = this.getNewOrder(this.orderLogText);
        this.orderLogText = this.order;
        break;
      }
      case 'user': {
        this.order = this.getNewOrder(this.orderLogUser);
        this.orderLogUser = this.order;
        property = 'user.name';
        break;
      }
    }

    this.sortProperty = property;
  }

  /**
   * Orders receipt list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.logEventList = _.orderBy(
        this.logEventList,
        [
          logEvent => {
            if (logEvent[this.sortProperty]) {
              return lowerCase(logEvent[this.sortProperty]) as string;
            } else {
              return logEvent[this.sortProperty.slice(0, -5)] ? (lowerCase(logEvent[this.sortProperty.slice(0, -5)].name) as string) : '';
            }
          }
        ],
        [this.order]
      );
    }
  }

  /**
   * Returns new order given old one
   * @param order
   */
  getNewOrder(order: string) {
    switch (order) {
      case 'asc':
        return 'desc';
      default:
        return 'asc';
    }
  }
}
