import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../../../../datamodels/document';
import { LogEvent } from '../../../../datamodels/logEvent';
import { lowerCase } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

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

  /**
   * Show modal with document details
   */
  openDocumentDetail() {
    this.modalService.detailDocument.next(this.document);
  }
}
