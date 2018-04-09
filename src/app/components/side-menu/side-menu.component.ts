import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  user: User;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => (this.user = user));
  }

  /**
   * User logout
   */
  logout() {
    this.authService.logout();
  }

  ngOnInit() {}
}
