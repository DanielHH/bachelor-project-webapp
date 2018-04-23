import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';
import { registerLocaleData } from '@angular/common';
import swedish from '@angular/common/locales/sv';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SecTrack';
  user: User;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title
  ) {
    this.authService.user.subscribe(user => {
      this.user = user;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const routeTitle = route.root.firstChild.snapshot.data['name'];
        let newTitle = '';

        if (routeTitle != this.title) {
          newTitle = this.title + ' - ';
        }
        this.titleService.setTitle(newTitle + routeTitle);
      }
    });
  }

  ngOnInit() {
    /* Needed by the DatePipe used to format dates and times */
    registerLocaleData(swedish);
  }
}
