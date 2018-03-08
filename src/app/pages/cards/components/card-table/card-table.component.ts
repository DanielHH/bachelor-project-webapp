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

  showAddNewModal = false;

  showEditModal = false;

  @ViewChild('addNewCardComponent') addNewCardComponent: ModifyCardComponent;

  @ViewChild('editCardComponent') editCardComponent: ModifyCardComponent;

  @ViewChild('addNewCardForm') addNewCardForm: NgForm;

  @ViewChild('editCardForm') editCardForm: NgForm;

  filterInput = '';

  orderCardType = '';
  orderCardNumber = '';
  orderUserID = '';
  orderLocation = '';
  orderComment = '';
  orderDate = '';

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
   * Set card to be edited. Called when edit option was clicked.
   */
  setEditCard(card: any) {
    this.editCard = card;
    this.showEditModal = true;
  }

  /**
   * Triggers submission of new card to server.
   */
  submitNewCard() {
    this.addNewCardComponent.addNewCard().then(() => {
      this.showAddNewModal = false;
      this.addNewCardForm.resetForm();
    });
  }

  /**
   * Triggers submission of edited card to server.
   */
  submitEditCard() {
    this.editCardComponent.editCard(this.editCard).then(() => {
      this.showEditModal = false;
      this.editCard = null;
      this.editCardForm.resetForm();
    });
  }

}

