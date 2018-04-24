import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../../../../datamodels/document';
import { MatchFilterDocumentPipe } from '../../../../pipes/match-filter-document.pipe';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { lowerCase } from '../../../../services/utilities.service';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements OnInit {
  @Input() documentList: Document[];

  showModal = false;
  showPdfGenerationModal = false;

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

  constructor(
    private modalService: ModalService,
    private httpService: HttpService,
    private documentPipe: MatchFilterDocumentPipe
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after modifiedDate ascending
   */
  sortTableListStart() {
    this.documentList = _.orderBy(this.documentList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the Card
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'status.name': {
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
    }

    if (newOrder) {
      this.documentList = _.orderBy(
        this.documentList,
        [
          document => {
            if (document[property]) {
              return lowerCase(document[property]) as string;
            } else {
              return document[property.slice(0, -5)] ? (lowerCase(document[property.slice(0, -5)].name) as string) : '';
            }
          }
        ],
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
