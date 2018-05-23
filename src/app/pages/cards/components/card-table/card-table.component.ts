import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../../../../datamodels/card';
import { MatchFilterCardPipe } from '../../../../pipes/match-filter-card.pipe';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService, lowerCase } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit, OnDestroy {

  showModal = false;

  showPdfGenerationModal = false;

  order = 'desc';
  sortProperty = 'modifiedDate';

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

  dataServiceSubscriber: any;

  cardList: Card[] = [];

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private cardPipe: MatchFilterCardPipe,
    private utilitiesService: UtilitiesService,
    private dataService: DataService
  ) {
    this.dataServiceSubscriber = this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
      this.orderTableList();
    });
  }

  ngOnInit() {
    this.orderTableList();
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }

  /**
   * Update order and order property
   * @param property
   */
  updateOrder(property: string) {
    this.sortProperty = property;

    switch (property) {
      case 'status.name': {
        this.order = this.getNewOrder(this.orderStatus);
        this.orderStatus = this.order;
        break;
      }
      case 'cardType.name': {
        this.order = this.getNewOrder(this.orderCardType);
        this.orderCardType = this.order;
        break;
      }
      case 'cardNumber': {
        this.order = this.getNewOrder(this.orderCardNumber);
        this.orderCardNumber = this.order;
        break;
      }
      case 'user.name': {
        this.order = this.getNewOrder(this.orderUser);
        this.orderUser = this.order;
        break;
      }
      case 'location': {
        this.order = this.getNewOrder(this.orderLocation);
        this.orderLocation = this.order;
        break;
      }
      case 'comment': {
        this.order = this.getNewOrder(this.orderComment);
        this.orderComment = this.order;
        break;
      }
      case 'expirationDate': {
        this.order = this.getNewOrder(this.orderDate);
        this.orderDate = this.order;
        break;
      }
    }
  }

  /**
   * Orders card list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.cardList = _.orderBy(
        this.cardList,
        [
          card => {
            if (card[this.sortProperty]) {
              return lowerCase(card[this.sortProperty]) as string;
            } else {
              return card[this.sortProperty.slice(0, -5)] ?
              (lowerCase(card[this.sortProperty.slice(0, -5)].name) as string) : '';
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

    this.generateFilterArray();

    this.modalService.pdfFilteredList.next(filteredList);
  }

  generateFilterArray() {
    const filters = [];

    if (this.filterInput) {
      filters.push(this.filterInput);
    }

    if (this.showIn) {
      filters.push('Tillgängliga');
    }

    if (this.showOut) {
      filters.push('Utkvitterade');
    }

    if (this.showArchived) {
      filters.push('Arkiverade');
    }

    if (this.showGone) {
      filters.push('Borttappade');
    }

    this.modalService.filterList.next(filters);
  }
}
