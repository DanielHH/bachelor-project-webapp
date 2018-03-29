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
import { Verification } from '../../../../datamodels/verification';
import { UtilitiesService } from '../../../../services/utilities.service';

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
  verificationList: Verification[];
  cardList: Card[];
  documentList: Document[];

  constructor(
    private dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private utilitiesService: UtilitiesService
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
    this.dataService.verificationList.subscribe(verificationList => {
      this.verificationList = verificationList;
    });
    this.dataService.verificationList.subscribe(verificationList => {
      this.verificationList = verificationList;
    });
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
  }

  ngOnInit() {}

  /**
   * Send a message to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(): void {
    if (this.baseItem) {

      const itemToUpdate: Card | Document = this.baseItem.getItem();

      const verification = new Verification();

      if (this.baseItem.isCard()) {
        verification.card = itemToUpdate as Card;
      } else {
        verification.document = itemToUpdate as Document;
      }

      itemToUpdate.modifiedDate = this.utilitiesService.getLocalDate();
      itemToUpdate.lastVerificationID = verification.id;

      verification.itemType = this.baseItem.getItemType();
      verification.user = this.baseItem.getUser();

      // Submit changes to database
      this.httpService.httpPost<Verification>('addNewVerification/', verification).then(verificationRes => {
        if (verificationRes.message === 'success') {

          this.httpService.httpPut<Document>('updateDocument/', itemToUpdate).then(itemRes => {
            if (itemRes.message === 'success') {
              // Update verification list
              this.verificationList.unshift(verificationRes.data);
              this.verificationList = this.verificationList.slice();
              this.dataService.verificationList.next(this.verificationList);

              // Update card and document list
              this.dataService.documentList.next(this.documentList);
              this.dataService.cardList.next(this.cardList);
            }
          });
        }
      });
    }
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
