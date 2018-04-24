import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../../../../datamodels/card';
import { LogEvent } from '../../../../datamodels/logEvent';
import { lowerCase } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-cardhistory-table',
  templateUrl: './cardhistory-table.component.html',
  styleUrls: ['./cardhistory-table.component.scss']
})
export class CardhistoryTableComponent implements OnInit {
  @Input() logEventList: LogEvent[];
  @Input() card: Card;

  filterInput = '';

  orderLogDate = '';
  orderLogType = '';
  orderLogText = '';
  orderLogUser = '';

  showReceipt = true;
  showOther = true;

  constructor(private modalService: ModalService) {}

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
      this.logEventList = _.orderBy(
        this.logEventList,
        [
          logEvent => {
            if (logEvent[property]) {
              return lowerCase(logEvent[property]) as string;
            } else {
              return logEvent[property.slice(0, -5)] ? (lowerCase(logEvent[property.slice(0, -5)].name) as string) : '';
            }
          }
        ],
        [newOrder]
      );
    }
  }

  /**
   * Sets the order to sort by
   * @param order
   */
  sortTableListHelper(order: string) {
    switch (order) {
      case 'asc':
        return 'desc';
      default:
        return 'asc';
    }
  }

  openCardDetail() {
    this.modalService.detailCard.next(this.card);
  }
}
