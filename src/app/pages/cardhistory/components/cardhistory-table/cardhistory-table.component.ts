import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Receipt } from '../../../../datamodels/receipt';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cardhistory-table',
  templateUrl: './cardhistory-table.component.html',
  styleUrls: ['./cardhistory-table.component.scss']
})
export class CardhistoryTableComponent implements OnInit {

  @Input() receiptList: Receipt[];

  showModal = false;

  showReceipts = true;
  showChanges = false;

  modalTitle = '';

  modalType = 0;

  constructor() { }

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after modifiedDate ascending
   */
  sortTableListStart() {
    this.receiptList = _.orderBy(this.receiptList, ['modifiedDate'], ['desc']);
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

