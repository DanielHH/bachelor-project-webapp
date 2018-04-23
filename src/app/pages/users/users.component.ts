import { Component, OnInit } from '@angular/core';
import { User } from '../../datamodels/user';
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userList: User[] = [];

  constructor(public dataService: DataService) {
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {}
}
