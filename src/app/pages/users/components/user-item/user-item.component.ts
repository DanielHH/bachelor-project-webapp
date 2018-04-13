import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})

export class UserItemComponent implements OnInit {

  @Input() user: User;

  userList: User[] = [];

  isActive: boolean;

  constructor(
    private dataService: DataService,
    private router: Router,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService) {
      this.dataService.userList.subscribe(userList => {
        this.userList = userList;
      });
  }

  ngOnInit() { }

  /**
   * Set user to be outputted for editing
  */
  edit() {
    this.modalService.editUser.next(this.user);
  }

  /**
   * Sets the status of the user in the database
   */
  editStatus() {
    this.httpService.httpPut<User>('updateUser/', this.user).then(res => {
      if (res.message === 'success') {
        this.userList.slice();
        this.dataService.userList.next(this.userList);
      }
    });
  }
}

