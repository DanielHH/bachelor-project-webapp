import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Delivery } from '../../../../datamodels/delivery';
import { MatchFilterDeliveryPipe } from '../../../../pipes/match-filter-delivery.pipe';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { lowerCase } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  styleUrls: ['./delivery-table.component.scss']
})
export class DeliveryTableComponent implements OnInit, OnDestroy {
  deliveryList: Delivery[] = [];

  editDelivery: Delivery = null; // delivery document to be edited

  dummyItem = new Delivery();

  showModal = false;
  showPdfGenerationModal = false;

  order = 'desc';
  sortProperty = 'modifiedDate';

  filterInput = '';

  orderStatus = '';
  orderDocumentType = '';
  orderDocumentNumber = '';
  orderName = '';
  orderReceiver = '';
  orderSentDate = '';
  orderComment = '';

  showActive = true;
  showArchived = false;
  showGone = false;

  modalTitle = '';

  modalType = 0;

  url = '';

  dataServiceSubscriber: any;

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private deliveryPipe: MatchFilterDeliveryPipe,
    private dataService: DataService
  ) {
    this.dataServiceSubscriber = this.dataService.deliveryList.subscribe(deliveryList => {
      this.deliveryList = deliveryList;
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
      case 'documentType.name': {
        this.order = this.getNewOrder(this.orderDocumentType);
        this.orderDocumentType = this.order;
        break;
      }
      case 'documentNumber': {
        this.order = this.getNewOrder(this.orderDocumentNumber);
        this.orderDocumentNumber = this.order;
        break;
      }
      case 'name': {
        this.order = this.getNewOrder(this.orderName);
        this.orderName = this.order;
        break;
      }
      case 'receiver': {
        this.order = this.getNewOrder(this.orderReceiver);
        this.orderReceiver = this.order;
        break;
      }
      case 'sentDate': {
        this.order = this.getNewOrder(this.orderSentDate);
        this.orderSentDate = this.order;
        break;
      }
      case 'comment': {
        this.order = this.getNewOrder(this.orderComment);
        this.orderComment = this.order;
        break;
      }
    }

  }

  /**
   * Orders delivery list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.deliveryList = _.orderBy(
        this.deliveryList,
        [
          delivery => {
            if (delivery[this.sortProperty]) {
              return lowerCase(delivery[this.sortProperty]) as string;
            } else {
              return delivery[this.sortProperty.slice(0, -5)] ?
              (lowerCase(delivery[this.sortProperty.slice(0, -5)].name) as string) : '';
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
   * Set document to be edited and open edit modal
   */
  openAddNewDelivery() {
    this.modalService.editDelivery.next(null);
  }

  openPdfGenerationModal() {
    const filteredList = this.deliveryPipe.transform(
      this.deliveryList,
      this.filterInput,
      this.showActive,
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

    if (this.showActive) {
      filters.push('Levererade');
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
