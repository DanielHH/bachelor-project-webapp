import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import * as _ from 'lodash';
import { ModifyTypeComponent } from '../modify-type/modify-type.component';
import { NgForm } from '@angular/forms';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { BaseType } from '../../../../datamodels/baseType';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-type-table',
  templateUrl: './type-table.component.html',
  styleUrls: ['./type-table.component.scss']
})
export class TypeTableComponent implements OnInit {

  @Input() typeList: BaseType[];

  showModal = false;

  filterInput = '';

  orderName = '';
  orderStatus = '';
  orderCreationDate = '';
  orderModifiedDate = '';

  showCardTypes = true;
  showDocumentTypes = true;
  showActive = true;
  showInactive = false;

  modalTitle = '';

  modalType = 0;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after location descending
   */
  sortTableListStart() {
    this.typeList = _.orderBy(this.typeList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the properties of the items
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'type.status.id': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'type.name': {
        newOrder = this.sortTableListHelper(this.orderName);
        this.orderName = newOrder;
        break;
      }
      case 'type.creationDate': {
        newOrder = this.sortTableListHelper(this.orderCreationDate);
        this.orderCreationDate = newOrder;
        break;
      }
      case 'type.modifiedDate': {
        newOrder = this.sortTableListHelper(this.orderModifiedDate);
        this.orderModifiedDate = newOrder;
        break;
      }
    }

    if (newOrder) {
      this.typeList = _.orderBy(this.typeList, [property], [newOrder]);
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
   * Open add new type modal
   */
  openAddNewType() {
    this.modalService.editType.next(null);
  }

}

