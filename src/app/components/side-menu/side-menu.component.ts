import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor( private auth: AuthService) { }

  // TODO: move function?
  logout(): void {
    console.log('logout func');
    this.auth.logout();
  }

  ngOnInit() {
  }

}
