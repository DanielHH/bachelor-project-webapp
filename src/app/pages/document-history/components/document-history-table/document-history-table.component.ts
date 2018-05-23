import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../../../../datamodels/document';
import { LogEvent } from '../../../../datamodels/logEvent';
import { lowerCase } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';
import { DataService } from '../../../../services/data.service';
import { RouteDataService } from '../../../../services/route-data.service';

@Component({
  selector: 'app-document-history-table',
  templateUrl: './document-history-table.component.html',
  styleUrls: ['./document-history-table.component.scss']
})
export class DocumentHistoryTableComponent implements OnInit, OnDestroy {
  document: Document;

  order = 'desc';
  sortProperty = 'logDate';

  filterInput = '';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showOther = true;

  routeDataServiceSubscriber: any;
  dataServiceSubscriber: any;

  logEventList: LogEvent[];
  filteredLogEventList: LogEvent[];

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private routeDataService: RouteDataService
  ) {
    this.routeDataServiceSubscriber = this.routeDataService.document.subscribe(document => {
      this.document = document;
      if (this.logEventList) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.document && logEvent.document.id) {
            return logEvent.document.id == this.document.id;
          }
          return false;
        });
      }
      this.orderTableList();
    });

    this.dataServiceSubscriber = this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
      if (this.document && this.document.id) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.document && logEvent.document.id) {
            return logEvent.document.id == this.document.id;
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
    this.routeDataServiceSubscriber.unsubscribe();

    this.dataServiceSubscriber.unsubscribe();
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
   * Show modal with document details
   */
  openDocumentDetail() {
    this.modalService.detailDocument.next(this.document);
  }
}
