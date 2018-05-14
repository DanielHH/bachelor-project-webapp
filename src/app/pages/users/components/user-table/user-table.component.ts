import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../../../../datamodels/user';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @Input() userList: User[];

  showModal = false;

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

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after location descending
   */
  sortTableListStart() {
    this.userList = _.orderBy(this.userList, ['modifiedDate'], ['desc']);
  }

  /**
   * Sorts the table depending on the properties of the items
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';

    switch (property) {
      case 'status.id': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        break;
      }
      case 'username': {
        newOrder = this.sortTableListHelper(this.orderUsername);
        this.orderUsername = newOrder;
        break;
      }
      case 'name': {
        newOrder = this.sortTableListHelper(this.orderName);
        this.orderName = newOrder;
        break;
      }
      case 'email': {
        newOrder = this.sortTableListHelper(this.orderEmail);
        this.orderEmail = newOrder;
        break;
      }
      case 'creationDate': {
        newOrder = this.sortTableListHelper(this.orderCreationDate);
        this.orderCreationDate = newOrder;
        break;
      }
      case 'modifiedDate': {
        newOrder = this.sortTableListHelper(this.orderModifiedDate);
        this.orderModifiedDate = newOrder;
        break;
      }
    }

    if (newOrder) {
      this.userList = _.orderBy(this.userList, [property], [newOrder]);
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
   * Open add new user modal
   */
  openAddNewUser() {
    this.modalService.editUser.next(null);
  }
}
