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
import { VerificationType } from '../../../../datamodels/verificationType';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input() baseItem: BaseItem;
  isChecked: boolean;

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
  private utilitiesService: UtilitiesService,
  private modalService: ModalService
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
  this.dataService.cardList.subscribe(cardList => {
    this.cardList = cardList;
  });
  this.dataService.documentList.subscribe(documentList => {
    this.documentList = documentList;
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
    this.httpService
    .httpPut<Card>('updateCard/', this.baseItem.getItem())
    .then(res => {
      if (res.message === 'success') {
      this.dataService.cardList.next(this.cardList);
      }
    });
  } else {
    this.httpService
    .httpPut<Document>('updateDocument/', this.baseItem.getItem())
    .then(res => {
      if (res.message === 'success') {
      this.dataService.documentList.next(this.documentList);
      }
    });
  }
  }

  /**
   * Send a message to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(selfVerification = false): void {
  if (this.baseItem) {
    const itemToUpdate: Card | Document = this.baseItem.getItem();

    const verification = new Verification();

    if (this.baseItem.isCard()) {
    verification.card = itemToUpdate as Card;
    verification.document = null;
    } else {
    verification.document = itemToUpdate as Document;
    verification.card = null;
    }

    if (this.baseItem.getUser() && this.baseItem.getUser().id !== 0) {
    verification.user = this.baseItem.getUser();
    } else {
    verification.user = null;
    itemToUpdate.user = null;
    }

    if (itemToUpdate.activeReceipt === 0) {
    itemToUpdate.activeReceipt = null;
    }

    verification.verificationType = selfVerification ? new VerificationType('Egenkontroll') : new VerificationType('Inventering');
    verification.itemType = this.baseItem.getItemType();
    verification.verificationDate = this.utilitiesService.getLocalDate();

    // Submit changes to database
    this.httpService
    .httpPost<Verification>('addNewVerification/', verification)
    .then(verificationRes => {
      if (verificationRes.message === 'success') {
      itemToUpdate.lastVerificationID = Number(verificationRes.data.id);
      itemToUpdate.lastVerificationDate = this.utilitiesService.getLocalDate();
      itemToUpdate.modifiedDate = this.utilitiesService.getLocalDate();

      if (this.baseItem.isCard()) {
        this.httpService
        .httpPut<Card>('updateCard/', {cardItem: itemToUpdate})
        .then(cardRes => {
          if (cardRes.message === 'success') {
          this.dataService.cardList.next(this.cardList);
          }
        });
      } else {
        this.httpService
        .httpPut<Document>('updateDocument/', {documentItem: itemToUpdate})
        .then(documentRes => {
          if (documentRes.message === 'success') {
          this.dataService.documentList.next(this.documentList);
          }
        });
      }

      // Update verification list
      this.verificationList.unshift(verificationRes.data);
      this.verificationList = this.verificationList.slice();
      this.dataService.verificationList.next(this.verificationList);
      }
    });
  }
  }

  getUser() {
  return this.utilitiesService.getUserString(this.baseItem.getUser());
  }
}
