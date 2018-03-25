import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { BaseItem } from '../../../../datamodels/baseItem';
import * as _ from 'lodash';
import { ModifyCardComponent } from '../../../cards/components/modify-card/modify-card.component';
import { NgForm } from '@angular/forms';
import { MatchFilterCardPipe } from '../../../../pipes/match-filter-card.pipe';
import { MatchFilterDocumentPipe } from '../../../../pipes/match-filter-document.pipe';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})

export class InventoryTableComponent implements OnInit {

  @Input() cardList: Card[];
  @Input() documentList: Document[];

  editCard: Card = null; // Card to be edited

  showModal = false;

  filterInput = '';

  orderStatus = '';
  orderCardType = '';
  orderCardNumber = '';
  orderUserID = '';
  orderLocation = '';
  orderComment = '';
  orderDate = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;

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
    this.cardList = _.orderBy(this.cardList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the Card
   * @param property
   */
  sortTableList(property: string) {
    // TODO: reimplement me!
    return; /*
    let newOrder = '';

    switch (property) {
      case 'status': {
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
      case 'userID': {
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
   * Set card to be edited and open edit modal
   *
  openEdit(card: any) {
    this.editCard = card;
    this.modalTitle = 'Edit card';
    this.modalType = 1;
    this.showModal = true;
  }*/


/**
 * Helper for the html file of this component.
 * Constructs a new BaseItem from the given item.
 */
  makeItem(item: Card|Document, itemType: string): BaseItem {
    return new BaseItem(item, itemType);
  }

}

