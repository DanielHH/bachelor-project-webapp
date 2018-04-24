import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../datamodels/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  userList: User[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
