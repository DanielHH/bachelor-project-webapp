import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { User } from '../../datamodels/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  userList: User[] = [];

  constructor(
    public dataService: DataService
  ) {
    this.dataService.userList.subscribe((userList) => {
      this.userList = userList;
    });

  }

  ngOnInit() {
  }

}

