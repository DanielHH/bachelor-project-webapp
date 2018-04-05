import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDataService } from '../../services/route-data.service';
import { Card } from '../../datamodels/card';
import { Document } from '../../datamodels/document';
import { HttpService } from '../../services/http.service';
import * as moment from 'moment';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit {

  @Input() item: any; // Card or Document

  @Input() showDetailsOption = false;

  @Input() showEditOption = false;

  @Output() editItem = new EventEmitter<any>();

  @Output() editStatus = new EventEmitter<any>();

  constructor(private routeDataService: RouteDataService, private router: Router,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService) { }

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

    if (this.item.documentType && this.item.location) { // document with a location, aka not a delivery
      this.routeDataService.document.next(this.item);
      this.router.navigate(['document-detail']);
    }
  }

  /**
   * Set item to be outputted for editing.
  */
  edit() {
    this.editItem.next();
  }

  /**
   * Setter for item status
   * @param value value to be set in the database
   */
  setStatus(value: number) {
    if (this.item.user && this.item.user.id && value == 1) { // If has owner and is restored
      this.item.status = this.utilitiesService.getStatusFromID(2);
    } else {
      this.item.status = this.utilitiesService.getStatusFromID(value);
    }

    this.editStatus.emit();
  }

}
