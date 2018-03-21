import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import * as _ from 'lodash';
import { ModifyDocumentComponent } from '../modify-document/modify-document.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements OnInit {

  @Input() documentList: Document[];

  editDocument: Document = null; // Document to be edited

  showModal = false;

  filterInput = '';

  orderStatus = '';
  orderDocumentType = '';
  orderDocumentNumber = '';
  orderName = '';
  orderUserID = '';
  orderLocation = '';
  orderComment = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;
  modalTitle = '';

  modalType = 0;

  constructor() { }

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
      case 'status': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'documentType': {
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
    }

    if (newOrder) {
      this.documentList = _.orderBy(this.documentList, [property], [newOrder]);
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
   * Set document to be edited and open edit modal
   */
  openEdit(document: any) {
    this.editDocument = document;
    this.modalTitle = 'Edit document';
    this.modalType = 1;
    this.showModal = true;
  }

  /**
   * Set document to be edited and open edit modal
   */
  openAddNewDocument() {
    this.editDocument = Object.assign({}, new Document());
    this.modalTitle = 'Add new document';
    this.modalType = 0;
    this.showModal = true;
  }



}

