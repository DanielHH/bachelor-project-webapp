import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  user: User;

  subMenu: any;

  authServiceSubscriber: any;

  constructor(private authService: AuthService,
    public dataService: DataService) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  /**
   * User logout
   */
  logout() {
    this.authService.logout();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();
  }
}
