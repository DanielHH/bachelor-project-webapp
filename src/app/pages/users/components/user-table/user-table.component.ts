import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../../../../datamodels/user';
import { ModalService } from '../../../../services/modal.service';
import { DataService } from '../../../../services/data.service';
import { lowerCase } from '../../../../services/utilities.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, OnDestroy {
  showModal = false;

  order = 'desc';
  sortProperty = 'modifiedDate';

  filterInput = '';

  orderStatus = '';
  orderUsername = '';
  orderName = '';
  orderEmail = '';
  orderCreationDate = '';
  orderModifiedDate = '';

  showAdmins = true;
  showUsers = true;
  showActive = true;
  showInactive = false;

  modalTitle = '';

  modalType = 0;

  userList: User[] = [];

  dataServiceSubscriber: any;

  constructor(private modalService: ModalService, private dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.userList.subscribe(userList => {
      this.userList = userList;
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
      case 'status.id': {
        this.order = this.getNewOrder(this.orderStatus);
        this.orderStatus = this.order;
        break;
      }
      case 'username': {
        this.order = this.getNewOrder(this.orderUsername);
        this.orderUsername = this.order;
        break;
      }
      case 'name': {
        this.order = this.getNewOrder(this.orderName);
        this.orderName = this.order;
        break;
      }
      case 'email': {
        this.order = this.getNewOrder(this.orderEmail);
        this.orderEmail = this.order;
        break;
      }
      case 'creationDate': {
        this.order = this.getNewOrder(this.orderCreationDate);
        this.orderCreationDate = this.order;
        break;
      }
      case 'modifiedDate': {
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
      this.userList = _.orderBy(this.userList, [this.sortProperty], [this.order]);
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
   * Open add new user modal
   */
  openAddNewUser() {
    this.modalService.editUser.next(null);
  }
}
