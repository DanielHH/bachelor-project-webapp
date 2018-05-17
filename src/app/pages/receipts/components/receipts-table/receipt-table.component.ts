import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Receipt } from '../../../../datamodels/receipt';
import { MatchFilterReceiptPipe } from '../../../../pipes/match-filter-receipt.pipe';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService, lowerCase } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-receipt-table',
  templateUrl: './receipt-table.component.html',
  styleUrls: ['./receipt-table.component.scss']
})
export class ReceiptTableComponent implements OnInit, OnDestroy {

  showPdfGenerationModal = false;

  order = 'desc';
  sortProperty = 'startDate';

  filterInput = '';

  orderStatus = '';
  orderType = '';
  orderNumber = '';
  orderUser = '';
  orderStartDate = '';
  orderEndDate = '';

  showCard = true;
  showDocument = true;
  showActive = true;
  showInactive = false;

  url = '';

  dataServiceSubscriber: any;

  receiptList: Receipt[] = [];

  constructor(
    private receiptPipe: MatchFilterReceiptPipe,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private dataService: DataService
  ) {
    this.dataServiceSubscriber = this.dataService.receiptList.subscribe(receiptList => {
      this.receiptList = receiptList;
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

    let orderFunc = (item: Receipt) => '';
    switch (property) {
      case 'status':
        this.order = this.getNewOrder(this.orderStatus);
        this.orderStatus = this.order;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).endDate ? 'Inaktiv' : 'Aktiv');
        break;
      case 'type': {
        this.order = this.getNewOrder(this.orderType);
        this.orderType = this.order;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).getSubType().name);
        break;
      }
      case 'number': {
        this.order = this.getNewOrder(this.orderNumber);
        this.orderNumber = this.order;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).getNumber());
        break;
      }
      case 'user': {
        this.order = this.getNewOrder(this.orderUser);
        this.orderUser = this.order;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getUserString(new Receipt(item).getUser()));
        break;
      }
      case 'startDate': {
        this.order = this.getNewOrder(this.orderStartDate);
        this.orderStartDate = this.order;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getDateString(new Receipt(item).startDate));
        break;
      }
      case 'endDate': {
        this.order = this.getNewOrder(this.orderEndDate);
        this.orderEndDate = this.order;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getDateString(new Receipt(item).endDate));
        break;
      }
    }
  }

  /**
   * Orders receipt list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.receiptList = _.orderBy(
        this.receiptList,
        [
          receipt => {
            if (receipt[this.sortProperty]) {
              return lowerCase(receipt[this.sortProperty]) as string;
            } else {
              return receipt[this.sortProperty.slice(0, -5)] ?
              (lowerCase(receipt[this.sortProperty.slice(0, -5)].name) as string) : '';
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

  passFilter(receipt: Receipt) {
    return this.receiptPipe.matchFilt(
      receipt,
      this.filterInput,
      this.showCard,
      this.showDocument,
      this.showActive,
      this.showInactive
    );
  }

  openPdfGenerationModal() {
    const filteredList = this.receiptPipe.transform(
      this.receiptList,
      this.filterInput,
      this.showCard,
      this.showDocument,
      this.showActive,
      this.showInactive
    );

    this.generateFilterArray();

    this.modalService.pdfFilteredList.next(filteredList);
  }

  generateFilterArray() {
    const filters = [];

    if (this.filterInput) {
      filters.push(this.filterInput);
    }

    if (this.showCard) {
      filters.push('Kort');
    }

    if (this.showDocument) {
      filters.push('Handlingar');
    }

    if (this.showActive) {
      filters.push('Aktiva');
    }

    if (this.showInactive) {
      filters.push('Inaktiva');
    }

    this.modalService.filterList.next(filters);
  }
}
