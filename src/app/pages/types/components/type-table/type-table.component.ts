import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import * as _ from 'lodash';
import { ModifyTypeComponent } from '../modify-type/modify-type.component';
import { NgForm } from '@angular/forms';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { BaseType } from '../../../../datamodels/baseType';

@Component({
  selector: 'app-type-table',
  templateUrl: './type-table.component.html',
  styleUrls: ['./type-table.component.scss']
})
export class TypeTableComponent implements OnInit {

  @Input() typeList: BaseType[];

  typeItem = new CardType(); // Dummy

  showModal = false;

  filterInput = '';

  orderName = '';
  orderStatus = '';
  orderType = '';
  orderDate = '';

  showCardTypes = true;
  showDocumentTypes = true;
  showActive = true;
  showInactive = false;

  modalTitle = '';

  modalType = 0;

  constructor() { }

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after location descending
   */
  sortTableListStart() {
    // this.typeList = _.orderBy(this.typeList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the properties of the items
   * @param property
   */
  sortTableList(property: string) {
    /*let newOrder = '';

    switch (property) {
      case 'status.id': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'cardType': {
        newOrder = this.sortTableListHelper(this.orderCardType);
        this.orderCardType = newOrder;
        break;
      }
      case 'cardNumber': {
        newOrder = this.sortTableListHelper(this.orderCardNumber);
        this.orderCardNumber = newOrder;
        break;
      }
      case 'user.id': {
        newOrder = this.sortTableListHelper(this.orderUserID);
        this.orderUserID = newOrder;
        break;
      }
      case 'location': {
        newOrder = this.sortTableListHelper(this.orderLocation);
        this.orderLocation = newOrder;
        break;
      }
      case 'comment': {
        newOrder = this.sortTableListHelper(this.orderComment);
        this.orderComment = newOrder;
        break;
      }
      case 'expirationDate': {
        newOrder = this.sortTableListHelper(this.orderDate);
        this.orderDate = newOrder;
        break;
      }
    }

    if (newOrder) {
      this.cardList = _.orderBy(this.cardList, [property], [newOrder]);
    }*/

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

  /**
   * Open add new type modal
   */
  openAddNewType() {
    this.modalTitle = 'Lägg till ny typ';
    this.modalType = 0;
    this.showModal = true;
  }

}

