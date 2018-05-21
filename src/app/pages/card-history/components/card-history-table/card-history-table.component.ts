import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../../../../datamodels/card';
import { LogEvent } from '../../../../datamodels/logEvent';
import { lowerCase } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-card-history-table',
  templateUrl: './card-history-table.component.html',
  styleUrls: ['./card-history-table.component.scss']
})
export class CardHistoryTableComponent implements OnInit, OnDestroy {
  card: Card;

  order = 'desc';
  sortProperty = 'logDate';

  filterInput = '';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showOther = true;

  dataServiceSubscriber: any;
  routeDataServiceSubscriber: any;

  logEventList: LogEvent[] = [];
  filteredLogEventList: LogEvent[] = [];

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private routeDataService: RouteDataService
  ) {
    this.routeDataServiceSubscriber = this.routeDataService.card.subscribe(card => {
      this.card = card;
      if (this.logEventList) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.card && logEvent.card.id) {
            return logEvent.card.id == this.card.id;
          }
          return false;
        });
      }
      this.orderTableList();
    });
    this.dataServiceSubscriber = this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
      if (this.card && this.card.id) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.card && logEvent.card.id) {
            return logEvent.card.id == this.card.id;
          }
          return false;
        });
      }
      this.orderTableList();
    });
  }

  ngOnInit() {
    this.orderTableList();
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
    this.routeDataServiceSubscriber.unsubscribe();
  }

  /**
   * Update order and order property
   * @param property
   */
  updateOrder(property: string) {
    this.sortProperty = property;

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
  }

  /**
   * Orders card list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.filteredLogEventList = _.orderBy(
        this.filteredLogEventList,
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

  /**
   * Show modal with card details
   */
  openCardDetail() {
    this.modalService.detailCard.next(this.card);
  }
}
