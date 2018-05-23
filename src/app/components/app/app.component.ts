import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../datamodels/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SecTrack';
  user: User;

  authServiceSubscriber: any;

  routerSubscriber: any;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    this.routerSubscriber = this.router.events.subscribe(event => {
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
  }

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();

    this.routerSubscriber.unsubscribe();
  }
}
