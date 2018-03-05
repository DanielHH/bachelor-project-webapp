import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDataService } from '../../services/route-data.service';
import { Card } from '../../datamodels/card';
import { Document } from '../../datamodels/document';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit {

  // Card or Document
  @Input() item: any;

  @Output() editItem = new EventEmitter<any>();

  constructor(private routeDataService: RouteDataService, private router: Router) { }

  ngOnInit() {
  }

  /**
   * Change route and send route data
   */
  route() {
    if (this.item.cardType) {
      this.routeDataService.card.next(this.item);
      this.router.navigate(['card-detail']);
    }

    if (this.item.documentType) {
      this.routeDataService.document.next(this.item);
      this.router.navigate(['document-detail']);
    }
  }

  edit() {
    this.editItem.next();
  }
}
