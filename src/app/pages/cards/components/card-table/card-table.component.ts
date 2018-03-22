import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as _ from 'lodash';
import { ModifyCardComponent } from '../modify-card/modify-card.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  @Input() cardList: Card[];

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

  /**
   * Set card to be edited and open edit modal
   */
  openEdit(card: any) {
    this.editCard = Object.assign({}, new Card());
    this.editCard.id = 5;
    this.editCard = card;
    this.modalTitle = 'Edit card';
    this.modalType = 1;
    this.showModal = true;
  }

  /**
   * Open add new card modal
   */
  openAddNewCard() {
    this.editCard = Object.assign({}, new Card());
    this.modalTitle = 'Add new card';
    this.modalType = 0;
    this.showModal = true;
  }

}

