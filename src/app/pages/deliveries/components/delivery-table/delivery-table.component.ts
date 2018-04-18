import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { Delivery } from '../../../../datamodels/delivery';
import { ModalService } from '../../../../services/modal.service';
import { MatchFilterDeliveryPipe } from '../../../../pipes/match-filter-delivery.pipe';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-delivery-table',
  templateUrl: './delivery-table.component.html',
  styleUrls: ['./delivery-table.component.scss']
})
export class DeliveryTableComponent implements OnInit {
  @Input() deliveryList: Delivery[];

  editDelivery: Delivery = null; // delivery document to be edited

  dummyItem = new Delivery();

  showModal = false;

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

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private deliveryPipe: MatchFilterDeliveryPipe
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after modifiedDate ascending
   */
  sortTableListStart() {
    this.deliveryList = _.orderBy(this.deliveryList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the Card
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
      case 'documentType.name': {
        newOrder = this.sortTableListHelper(this.orderDocumentType);
        this.orderDocumentType = newOrder;
        break;
      }
      case 'documentNumber': {
        newOrder = this.sortTableListHelper(this.orderDocumentNumber);
        this.orderDocumentNumber = newOrder;
        break;
      }
      case 'name': {
        newOrder = this.sortTableListHelper(this.orderName);
        this.orderName = newOrder;
        break;
      }
      case 'receiver': {
        newOrder = this.sortTableListHelper(this.orderReceiver);
        this.orderReceiver = newOrder;
        break;
      }
      case 'sentDate': {
        newOrder = this.sortTableListHelper(this.orderSentDate);
        this.orderSentDate = newOrder;
        break;
      }
      case 'comment': {
        newOrder = this.sortTableListHelper(this.orderComment);
        this.orderComment = newOrder;
        break;
      }
    }

    if (newOrder) {
      this.deliveryList = _.orderBy(this.deliveryList, [property], [newOrder]);
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
   * Set document to be edited and open edit modal
   */
  openAddNewDelivery() {
    this.modalService.editDelivery.next(null);
  }

  genPDF() {
    const filteredList = this.deliveryPipe.transform(
      this.deliveryList,
      this.filterInput,
      this.showActive,
      this.showArchived,
      this.showGone
    );

    this.httpService.httpPost<any>('genPDF', ['documents', filteredList]).then(pdfRes => {
      if (pdfRes.message === 'success') {
        this.url = pdfRes.url;
      }
    });
  }

  openPDF() {
    window.open(this.url, '_blank');
  }
}
