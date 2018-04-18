import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../../datamodels/receipt';
import * as _ from 'lodash';
import { HttpService } from '../../../../services/http.service';
import { MatchFilterReceiptPipe } from '../../../../pipes/match-filter-receipt.pipe';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-receipt-table',
  templateUrl: './receipt-table.component.html',
  styleUrls: ['./receipt-table.component.scss']
})
export class ReceiptTableComponent implements OnInit {
  @Input() receiptList: Receipt[];

  showPdfGenerationModal = false;

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

  constructor(
    private receiptPipe: MatchFilterReceiptPipe,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after startDate ascending
   */
  sortTableListStart() {
    this.receiptList = _.orderBy(this.receiptList, ['startDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the Receipt
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';
    let orderFunc = (item: Receipt) => '';
    switch (property) {
      case 'status':
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        orderFunc = (item: Receipt) => (new Receipt(item).endDate ? 'Inaktiv' : 'Aktiv');
        break;
      case 'type': {
        newOrder = this.sortTableListHelper(this.orderType);
        this.orderType = newOrder;
        orderFunc = (item: Receipt) => new Receipt(item).getSubType().name;
        break;
      }
      case 'number': {
        newOrder = this.sortTableListHelper(this.orderNumber);
        this.orderNumber = newOrder;
        orderFunc = (item: Receipt) => new Receipt(item).getNumber();
        break;
      }
      case 'user': {
        newOrder = this.sortTableListHelper(this.orderUser);
        this.orderUser = newOrder;
        orderFunc = (item: Receipt) => this.utilitiesService.getUserString(new Receipt(item).getUser());
        break;
      }
      case 'startDate': {
        newOrder = this.sortTableListHelper(this.orderStartDate);
        this.orderStartDate = newOrder;
        orderFunc = (item: Receipt) => this.utilitiesService.getDateString(new Receipt(item).startDate);
        break;
      }
      case 'endDate': {
        newOrder = this.sortTableListHelper(this.orderEndDate);
        this.orderEndDate = newOrder;
        orderFunc = (item: Receipt) => this.utilitiesService.getDateString(new Receipt(item).endDate);
        break;
      }
    }
    if (newOrder) {
      this.receiptList = _.orderBy(this.receiptList, [orderFunc], [newOrder]);
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
    this.modalService.pdfFilteredList.next(filteredList);
  }
}
