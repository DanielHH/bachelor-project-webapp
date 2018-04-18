import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as _ from 'lodash';
import { ModifyCardComponent } from '../modify-card/modify-card.component';
import { NgForm } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { HttpService } from '../../../../services/http.service';
import { MatchFilterCardPipe } from '../../../../pipes/match-filter-card.pipe';
import { lowerCase, UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {
  @Input() cardList: Card[];

  showModal = false;

  showPdfGenerationModal = false;

  filterInput = '';

  orderStatus = '';
  orderCardType = '';
  orderCardNumber = '';
  orderUser = '';
  orderLocation = '';
  orderComment = '';
  orderDate = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;

  modalTitle = '';

  modalType = 0;

  url = '';

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private cardPipe: MatchFilterCardPipe,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after location descending
   */
  sortTableListStart() {
    this.cardList = _.orderBy(this.cardList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the properties of the items
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'status.id': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'cardType.name': {
        newOrder = this.sortTableListHelper(this.orderCardType);
        this.orderCardType = newOrder;
        break;
      }
      case 'cardNumber': {
        newOrder = this.sortTableListHelper(this.orderCardNumber);
        this.orderCardNumber = newOrder;
        break;
      }
      case 'user.name': {
        newOrder = this.sortTableListHelper(this.orderUser);
        this.orderUser = newOrder;
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
      this.cardList = _.orderBy(
        this.cardList,
        [card => (card[property] ? (lowerCase(card[property]) as string) : (card[property] as string))],
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
   * Open add new card modal
   */
  openAddNewCard() {
    this.modalService.editCard.next(null);
  }

  openPdfGenerationModal() {
    const filteredList = this.cardPipe.transform(
      this.cardList,
      this.filterInput,
      this.showIn,
      this.showOut,
      this.showArchived,
      this.showGone
    );
    this.modalService.pdfFilteredList.next(filteredList);
  }
}
