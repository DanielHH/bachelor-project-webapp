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

  showAddNewModal = false;

  showEditModal = false;

  @ViewChild('addNewDocumentComponent') addNewDocumentComponent: ModifyDocumentComponent;

  @ViewChild('editDocumentComponent') editDocumentComponent: ModifyDocumentComponent;

  @ViewChild('addNewDocumentForm') addNewDocumentForm: NgForm;

  @ViewChild('editDocumentForm') editDocumentForm: NgForm;

  filterInput = '';

  orderDocumentType = '';
  orderDocumentNumber = '';
  orderName = '';
  orderUserID = '';
  orderLocation = '';
  orderComment = '';

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
   * Set document to be edited. Called when edit option was clicked.
   */
  setEditDocument(document: any) {
    this.editDocument = document;
    this.showEditModal = true;
  }

  /**
   * Triggers submission of new document to server.
   */
  submitNewDocument() {
    this.addNewDocumentComponent.addNewDocument().then(() => {
      this.showAddNewModal = false;
      this.addNewDocumentForm.resetForm();
    });
  }

  /**
   * Triggers submission of edited document to server.
   */
  submitEditDocument() {
    this.editDocumentComponent.editDocument(this.editDocument).then(() => {
      this.showEditModal = false;
      this.editDocument = null;
      this.editDocumentForm.resetForm();
    });
  }

}

