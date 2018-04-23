import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
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
    public utilitiesService: UtilitiesService
  ) {
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {}

  /**
   * Show the modal for user details
   */
  showDetailsModal() {
    this.modalService.detailUser.next(this.user);
  }

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
        this.dataService.getUserList();
      }
    });
  }
}
