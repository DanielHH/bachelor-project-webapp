import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { BaseType } from '../../../../datamodels/baseType';
import { ModalService } from '../../../../services/modal.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-type-table',
  templateUrl: './type-table.component.html',
  styleUrls: ['./type-table.component.scss']
})
export class TypeTableComponent implements OnInit, OnDestroy {
  showModal = false;

  order = 'desc';
  sortProperty = 'modifiedDate';

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

  dataServiceSubscriber: any;

  typeList: BaseType[] = [];

  constructor(private modalService: ModalService, private dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.typeList.subscribe(typeList => {
      this.typeList = typeList;
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
      case 'type.status.id': {
        this.order = this.getNewOrder(this.orderStatus);
        this.orderStatus = this.order;
        break;
      }
      case 'type.name': {
        this.order = this.getNewOrder(this.orderName);
        this.orderName = this.order;
        break;
      }
      case 'type.creationDate': {
        this.order = this.getNewOrder(this.orderCreationDate);
        this.orderCreationDate = this.order;
        break;
      }
      case 'type.modifiedDate': {
        this.order = this.getNewOrder(this.orderModifiedDate);
        this.orderModifiedDate = this.order;
        break;
      }
    }
  }

  /**
   * Orders card list based on set order and order property
   */
  orderTableList() {
    if (this.order) {
      this.typeList = _.orderBy(this.typeList, [this.sortProperty], [this.order]);
    }
  }

  /**
   * Sets the order to sort by
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
   * Open add new type modal
   */
  openAddNewType() {
    this.modalService.editType.next(null);
  }
}
