import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  user: User;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

}
