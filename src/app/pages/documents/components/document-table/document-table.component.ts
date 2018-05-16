import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../../../../datamodels/document';
import { MatchFilterDocumentPipe } from '../../../../pipes/match-filter-document.pipe';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { lowerCase } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements OnInit, OnDestroy {
  documentList: Document[] = [];

  showModal = false;
  showPdfGenerationModal = false;

  order = 'desc';
  sortProperty = 'modifiedDate';

  filterInput = '';

  orderStatus = '';
  orderDocumentType = '';
  orderDocumentNumber = '';
  orderName = '';
  orderUser = '';
  orderLocation = '';
  orderComment = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;
  modalTitle = '';

  modalType = 0;

  url = '';

  dataServiceSubscriber: any;

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private documentPipe: MatchFilterDocumentPipe,
    private dataService: DataService
  ) {
    this.dataServiceSubscriber = this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
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
    }
  }

  /**
   * Orders document list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.documentList = _.orderBy(
        this.documentList,
        [
          document => {
            if (document[this.sortProperty]) {
              return lowerCase(document[this.sortProperty]) as string;
            } else {
              return document[this.sortProperty.slice(0, -5)] ?
              (lowerCase(document[this.sortProperty.slice(0, -5)].name) as string) : '';
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
  openAddNewDocument() {
    this.modalService.editDocument.next(null);
  }

  openPdfGenerationModal() {
    const filteredList = this.documentPipe.transform(
      this.documentList,
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
