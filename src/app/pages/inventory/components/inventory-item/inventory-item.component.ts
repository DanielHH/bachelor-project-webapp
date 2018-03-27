import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { BaseItem } from '../../../../datamodels/baseItem';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input() baseItem: BaseItem;

  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  showRequestModal = false;

  showReturnModal = false;

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService
  ) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() {}

  /**
   * Send a message to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(): void {
    // TODO: implement me!
    return;
  }

  /**
   * Return a string representing when this item was last verified
   * to be in the inventory.
   */
  displayLastVerified(): string {
    // TODO: ask the backend
    // check that this baseitem is defined
    return 'Aldrig';
  }
}
