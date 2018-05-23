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

  sortProperty = 'startDate';

  filterInput = '';

  orderStatus = '';
  orderType = '';
  orderNumber = '';
  orderUser = '';
  orderStartDate = 'desc';
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
      this.orderTableList(this.sortProperty);
    });
  }

  ngOnInit() {
    this.orderTableList(this.sortProperty);
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }

  /**
   * Order table list based on order and order property
   * @param property
   */
  orderTableList(property: string) {
    this.sortProperty = property;
    let order = '';

    let orderFunc = (item: Receipt) => '';
    switch (property) {
      case 'status':
        order = this.orderStatus;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).endDate ? 'Inaktiv' : 'Aktiv');
        break;
      case 'type': {
        order = this.orderType;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).getSubType().name);
        break;
      }
      case 'number': {
        order = this.orderNumber;
        orderFunc = (item: Receipt) => lowerCase(new Receipt(item).getNumber());
        break;
      }
      case 'user': {
        order = this.orderUser;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getUserString(new Receipt(item).getUser()));
        break;
      }
      case 'startDate': {
        order = this.orderStartDate;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getDateString(new Receipt(item).startDate));
        break;
      }
      case 'endDate': {
        order = this.orderEndDate;
        orderFunc = (item: Receipt) => lowerCase(this.utilitiesService.getDateString(new Receipt(item).endDate));
        break;
      }
    }
    if (order) {
      this.receiptList = _.orderBy(this.receiptList, [orderFunc], [order]);
    }
  }

  /**
   * Sets the order of property to next one, ascending or descending
   * @param property whose order is to be changed
   */
  setNextOrder(property: String) {
    switch (property) {
      case 'status': {
        this.orderStatus = this.getNewOrder(this.orderStatus);
        break;
      }
      case 'type': {
        this.orderType = this.getNewOrder(this.orderType);
        break;
      }
      case 'number': {
        this.orderNumber = this.getNewOrder(this.orderNumber);
        break;
      }
      case 'user': {
        this.orderUser = this.getNewOrder(this.orderUser);
        break;
      }
      case 'startDate': {
        this.orderStartDate = this.getNewOrder(this.orderStartDate);
        break;
      }
      case 'endDate': {
        this.orderEndDate = this.getNewOrder(this.orderEndDate);
        break;
      }
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
