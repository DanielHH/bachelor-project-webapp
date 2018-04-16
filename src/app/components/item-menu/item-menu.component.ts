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

  @Input() object: any; // Card, CardType, Document or DocumentType

  @Input() adminMenu = false;

  @Input() isTypeItem = false;

  @Input() itemMenu = false;

  @Input() showHistoryOption = true;

  @Input() showEditOption = false;

  @Output() editObject = new EventEmitter<any>();

  @Output() editStatus = new EventEmitter<any>();

  constructor(private routeDataService: RouteDataService, private router: Router,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  /**
   * Change route and send route data, TODO: FIX THIS FOR TYPES AND USERS AS WELL?
   */
  route() {
    if (this.object.cardType) {
      this.routeDataService.card.next(this.object);
      this.router.navigate(['card-history']);
    }

    if (this.object.documentType && this.object.location) { // document with a location, aka not a delivery
      this.routeDataService.document.next(this.object);
      this.router.navigate(['document-history']);
    }
  }

  /**
   * Set item or type to be outputted for editing.
  */
  setEdit() {
    this.editObject.next();
  }

  /**
   * Setter for item status
   * @param value value to be set in the database
   */
  setStatus(value: number) {
    if ( // If is item that has owner and is being restored, set to "utkvitterad"
      this.itemMenu &&
      this.object.user &&
      this.object.user.id &&
      value == 1
    ) {
      this.object.status = this.utilitiesService.getStatusFromID(2);
    } else if (this.isTypeItem) {
      this.object.getType().status = this.utilitiesService.getStatusFromID(value);
    } else {
      this.object.status = this.utilitiesService.getStatusFromID(value);
    }

    this.editStatus.emit();
  }

  getStatusID() {
    if (this.isTypeItem) {
      return this.object.getType().status.id;
    } else {
      return this.object.status.id;
    }
  }

}
