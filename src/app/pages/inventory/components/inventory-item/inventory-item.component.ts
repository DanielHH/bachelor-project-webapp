import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseItem } from '../../../../datamodels/baseItem';
import { Card } from '../../../../datamodels/card';
import { CardType } from '../../../../datamodels/cardType';
import { Document } from '../../../../datamodels/document';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import { Verification } from '../../../../datamodels/verification';
import { VerificationType } from '../../../../datamodels/verificationType';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input() baseItem: BaseItem;

  cardList: Card[];
  documentList: Document[];
  baseItemList: BaseItem[];

  isChecked: boolean;

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
    this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
    });
    this.dataService.itemList.subscribe(baseItemList => {
      this.baseItemList = baseItemList;
    });
  }

  ngOnInit() {}

  /**
   * Shows the modal for inventory details
   */
  showDetailsModal() {
    this.modalService.detailInventory.next(this.baseItem);
  }

  /**
   * Sets the status of the document in the database
   */
  editStatus() {
    if (this.baseItem.isCard()) {
      this.httpService.httpPut<Card>('updateCard/', this.baseItem.getItem()).then(res => {
        if (res.message === 'success') {
          this.dataService.cardList.next(this.cardList);
        }
      });
    } else {
      this.httpService.httpPut<Document>('updateDocument/', this.baseItem.getItem()).then(res => {
        if (res.message === 'success') {
          this.dataService.documentList.next(this.documentList);
        }
      });
    }
  }

  getUser() {
    return this.utilitiesService.getUserString(this.baseItem.getUser());
  }

  updateSelected() {
    this.baseItem.isChecked = !this.baseItem.isChecked;
    this.dataService.itemList.next(this.baseItemList);
  }
}
