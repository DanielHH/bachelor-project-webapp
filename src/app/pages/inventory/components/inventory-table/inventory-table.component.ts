import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { BaseItem } from '../../../../datamodels/baseItem';
import * as _ from 'lodash';
import { ModifyCardComponent } from '../../../cards/components/modify-card/modify-card.component';
import { NgForm } from '@angular/forms';
import { lowerCase, UtilitiesService } from '../../../../services/utilities.service';
import { MatchFilterInventoryPipe } from '../../../../pipes/match-filter-inventory.pipe';
import { HttpService } from '../../../../services/http.service';
import { Verification } from '../../../../datamodels/verification';
import { InventoryItemComponent } from '../inventory-item/inventory-item.component';
import { ModalService } from '../../../../services/modal.service';
import { DataService } from '../../../../services/data.service';
import { VerificationType } from '../../../../datamodels/verificationType';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  showPdfGenerationModal = false;

  dummyItem: Card = new Card();

  filterInput = '';

  orderStatus = '';
  orderSubType = '';
  orderNumber = '';
  orderUser = '';
  orderLocation = '';
  orderComment = '';
  orderDate = '';
  orderItemType = '';
  orderVerifyDate = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;

  url = '';

  selectAll = false;

  baseItemList: BaseItem[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];
  verificationList: Verification[];
  cardList: Card[] = [];
  documentList: Document[];
  itemList: BaseItem[];

  constructor(
    private inventoryPipe: MatchFilterInventoryPipe,
    private utilitiesService: UtilitiesService,
    private httpService: HttpService,
    private modalService: ModalService,
    private dataService: DataService
  ) {
    this.dataService.itemList.subscribe(baseItemList => {
      this.baseItemList = baseItemList;
      this.updateSelectAll();
    });

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

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after subType ascending
   */
  sortTableListStart() {
    this.baseItemList = _.orderBy(this.baseItemList, [(item: BaseItem) => item.getLastVerifiedString()], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the BaseItem
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';
    let orderFunc = (item: BaseItem) => '';
    switch (property) {
      case 'status': {
        newOrder = this.sortTableListHelper(this.orderStatus);
        this.orderStatus = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(item.getStatus().name);
        break;
      }
      case 'subType': {
        newOrder = this.sortTableListHelper(this.orderSubType);
        this.orderSubType = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(item.getSubType().name);
        break;
      }
      case 'number': {
        newOrder = this.sortTableListHelper(this.orderNumber);
        this.orderNumber = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(item.getNumber());
        break;
      }
      case 'user': {
        newOrder = this.sortTableListHelper(this.orderUser);
        this.orderUser = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(this.utilitiesService.getUserString(item.getUser()));
        break;
      }
      case 'location': {
        newOrder = this.sortTableListHelper(this.orderLocation);
        this.orderLocation = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(item.getLocation());
        break;
      }
      case 'comment': {
        newOrder = this.sortTableListHelper(this.orderComment);
        this.orderComment = newOrder;
        orderFunc = (item: BaseItem) => lowerCase(item.getComment());
        break;
      }
    }
    if (newOrder) {
      this.baseItemList = _.orderBy(this.baseItemList, [orderFunc], [newOrder]);
    }
  }

  /**
   * Sets the order to sort by
   * @param order
   */
  sortTableListHelper(order: string) {
    switch (order) {
      case 'asc':
        return 'desc';
      default:
        return 'asc';
    }
  }

  getFilteredList() {
    return this.inventoryPipe.transform(
      this.baseItemList,
      this.filterInput,
      this.showIn,
      this.showOut,
      this.showArchived,
      this.showGone
    );
  }

  openPdfGenerationModal() {
    const filteredList = this.getFilteredList();

    const verificationList = [];
    const selectedVerificationList = [];
    let verification: Verification;

    filteredList.forEach(baseItem => {
      verification = new Verification();
      if (baseItem.isCard()) {
        verification.card = baseItem.getItem() as Card;
        verification.itemType = this.utilitiesService.getItemTypeFromID(1);
      } else {
        verification.document = baseItem.getItem() as Document;
        verification.itemType = this.utilitiesService.getItemTypeFromID(2);
      }

      verification.verificationType = this.utilitiesService.getVerificationTypeFromID(2);
      verification.user = baseItem.getItem().user;
      verification.verificationDate = baseItem.getItem().lastVerificationDate;

      verificationList.push(verification);

      if (baseItem.isChecked) {
        selectedVerificationList.push(verification);
      }
    });

    this.generateFilterArray();

    this.modalService.pdfSelectedList.next(selectedVerificationList);
    this.modalService.pdfFilteredList.next(verificationList);
  }

  /**
   * Update verification date for all checked items.
   */
  sendVerify(): void {
    // TODO: should send a single post containing all verifications
    this.getFilteredList().forEach(baseItem => {
      if (baseItem.isChecked) {
        this.verifyInventory(baseItem);
      }
    });
  }

  updateItemSelection() {
    setTimeout(() => {
      this.baseItemList.forEach(baseItem => {
        if (this.inventoryPipe.matchFilt(
            baseItem,
            this.filterInput,
            this.showIn,
            this.showOut,
            this.showArchived,
            this.showGone)) {
          baseItem.isChecked = this.selectAll;
        } else {
          baseItem.isChecked = false;
        }
      });
      this.baseItemList.slice();
      this.dataService.itemList.next(this.baseItemList);
    }, 100);
  }

  updateSelectAll() {
    for (const baseItem of this.getFilteredList()) {
      if (!baseItem.isChecked) {
        this.selectAll = false;
        break;
      }
    }
  }

  generateFilterArray() {
    const filters = [];

    if (this.filterInput) {
      filters.push(this.filterInput);
    }

    if (this.showIn) {
      filters.push('Tillgängliga');
    }

    if (this.showOut) {
      filters.push('Utkvitterade');
    }

    if (this.showArchived) {
      filters.push('Arkiverade');
    }

    if (this.showGone) {
      filters.push('Borttappade');
    }

    this.modalService.filterList.next(filters);
  }

  /**
   * Send a message to the backend updating when this item was last inventoried
   * to be the current time.
   */
  verifyInventory(baseItem: BaseItem, selfVerification = false): void {
    const itemToUpdate: Card | Document = baseItem.getItem();

    const verification = new Verification();

    if (baseItem.isCard()) {
      verification.card = itemToUpdate as Card;
      verification.document = null;
    } else {
      verification.document = itemToUpdate as Document;
      verification.card = null;
    }

    if (baseItem.getUser() && baseItem.getUser().id !== 0) {
      verification.user = baseItem.getUser();
    } else {
      verification.user = null;
    }

    if (itemToUpdate.activeReceipt === 0) {
      itemToUpdate.activeReceipt = null;
    }

    verification.verificationType = selfVerification
      ? new VerificationType('Egenkontroll')
      : new VerificationType('Inventering');
    verification.itemType = baseItem.getItemType();
    verification.verificationDate = this.utilitiesService.getLocalDate();

    // Submit changes to database
    this.httpService.httpPost<Verification>('addNewVerification/', verification).then(verificationRes => {
      if (verificationRes.message === 'success') {
        itemToUpdate.lastVerificationID = Number(verificationRes.data.id);
        itemToUpdate.lastVerificationDate = this.utilitiesService.getLocalDate();
        itemToUpdate.modifiedDate = this.utilitiesService.getLocalDate();

        if (baseItem.isCard()) {
          this.httpService.httpPut<Card>('updateCard/', { cardItem: itemToUpdate }).then(cardRes => {
            if (cardRes.message === 'success') {
              // So we don't adjust for timezone twice for dates not received from server
              itemToUpdate.lastVerificationDate = new Date();
              itemToUpdate.modifiedDate = new Date();
              this.dataService.cardList.next(this.cardList);
            }
          });
        } else {
          this.httpService.httpPut<Document>('updateDocument/', { documentItem: itemToUpdate }).then(documentRes => {
            if (documentRes.message === 'success') {
              // So we don't adjust for timezone twice for dates not received from server
              itemToUpdate.lastVerificationDate = new Date();
              itemToUpdate.modifiedDate = new Date();
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
