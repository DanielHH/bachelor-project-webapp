import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from '../../../../auth/auth.service';
import { BaseItem } from '../../../../datamodels/baseItem';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { Verification } from '../../../../datamodels/verification';
import { VerificationType } from '../../../../datamodels/verificationType';
import { MatchFilterInventoryPipe } from '../../../../pipes/match-filter-inventory.pipe';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService, lowerCase } from '../../../../services/utilities.service';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit, OnDestroy {
  showPdfGenerationModal = false;
  showVerifyConfirmationModal = false;

  dummyItem: Card = new Card();

  filterInput = '';

  orderStatus = '';
  orderSubType = '';
  orderNumber = '';
  orderUser = '';
  orderLocation = '';
  orderVerify = '';
  orderSelfCheck = '';
  orderDate = '';
  orderItemType = '';

  showIn = true;
  showOut = true;
  showArchived = false;
  showGone = false;

  url = '';

  selectAll = false;

  baseItemList: BaseItem[] = [];
  verificationList: Verification[] = [];
  itemList: BaseItem[] = [];

  dataServiceItemSubscriber: any;

  dataServiceVerificationSubscriber: any;

  authServiceSubscriber: any;

  user: User;

  constructor(
    private inventoryPipe: MatchFilterInventoryPipe,
    private utilitiesService: UtilitiesService,
    private httpService: HttpService,
    private modalService: ModalService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    this.dataServiceItemSubscriber = this.dataService.itemList.subscribe(baseItemList => {
      this.baseItemList = baseItemList;
    });

    this.dataServiceVerificationSubscriber = this.dataService.verificationList.subscribe(verificationList => {
      this.verificationList = verificationList;
    });

    this.authServiceSubscriber = this.authService.user.subscribe(user => (this.user = user));
  }

  ngOnInit() {
    this.sortTableListStart();
    this.updateSelectAll();
  }

  ngOnDestroy() {
    this.dataServiceItemSubscriber.unsubscribe();

    this.dataServiceVerificationSubscriber.unsubscribe();

    this.authServiceSubscriber.unsubscribe();
  }

  /**
   * Sort the table initially
   */
  sortTableListStart() {
    this.sortTableList('verify');
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
      case 'verify': {
        newOrder = this.sortTableListHelper(this.orderVerify);
        this.orderVerify = newOrder;
        orderFunc = (item: BaseItem) =>
          item.getItem().lastVerificationDate ? item.getItem().lastVerificationDate : '0000-00-00 00:00:00';
        break;
      }
      case 'selfCheck': {
        newOrder = this.sortTableListHelper(this.orderSelfCheck);
        this.orderSelfCheck = newOrder;
        orderFunc = (item: BaseItem) =>
          item.getItem().lastSelfCheckDate ? item.getItem().lastSelfCheckDate : '0000-00-00 00:00:00';
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
    const verificationList = [];
    const selectedVerificationList = [];
    let verification: Verification;

    _.forEach(this.getFilteredList(), baseItem => {
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
   * Returns the text for the verify button depending on the user
   */
  getVerifyButtonString() {
    return this.user.userType.id == 1 ? 'Inventera' : 'Egenkontroll';
  }

  /**
   * Show verify inventory confirmation modal
   */
  showVerifyModal() {
    let numObjects = 0;

    _.forEach(this.getFilteredList(), baseItem => {
      if (baseItem.isChecked) {
        numObjects++;
      }
    });

    if (numObjects) {
      this.modalService.numVerifyObjects.next(numObjects);
    }
  }

  /**
   * Update verification date for all checked items.
   */
  sendVerify(): void {
    // TODO: should send a single post containing all verifications
    _.forEach(this.getFilteredList(), baseItem => {
      if (baseItem.isChecked) {
        this.verifyInventory(baseItem);
      }
    });
  }

  updateSelection() {
    _.forEach(this.baseItemList, baseItem => {
      if (
        this.inventoryPipe.matchFilt(
          baseItem,
          this.filterInput,
          this.showIn,
          this.showOut,
          this.showArchived,
          this.showGone
        )
      ) {
        baseItem.isChecked = this.selectAll;
      } else {
        baseItem.isChecked = false;
      }
    });
    this.baseItemList.slice();
    this.dataService.itemList.next(this.baseItemList);
  }

  selectionChanged() {
    setTimeout(() => {
      this.updateSelection();
    }, 100);
  }

  updateSelectAll() {
    setTimeout(() => {
      if (!this.getFilteredList().length) {
        this.selectAll = false;
      } else {
        this.selectAll = true;
        for (const baseItem of this.getFilteredList()) {
          if (!baseItem.isChecked) {
            this.selectAll = false;
            break;
          }
        }
      }
    }, 100);
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
  verifyInventory(baseItem: BaseItem): void {
    const itemToUpdate: Card | Document = baseItem.getItem();
    const isVerification = this.user.userType.id == 1;
    const verification = new Verification();

    if (baseItem.isCard()) {
      verification.card = itemToUpdate as Card;
      verification.document = null;
    } else {
      verification.document = itemToUpdate as Document;
      verification.card = null;
    }

    verification.user = this.user;

    if (itemToUpdate.activeReceipt === 0) {
      itemToUpdate.activeReceipt = null;
    }

    if (isVerification) {
      verification.verificationType = new VerificationType('Inventering');
    } else {
      verification.verificationType = new VerificationType('Egenkontroll');
    }

    verification.itemType = baseItem.getItemType();
    verification.verificationDate = this.utilitiesService.getLocalDate();

    // Submit changes to database
    this.httpService.httpPost<Verification>('addNewVerification/', verification).then(verificationRes => {
      if (verificationRes.message === 'success') {
        let logTypeID: number;
        if (isVerification) {
          logTypeID = 6;
          itemToUpdate.lastVerificationID = Number(verificationRes.data.id);
          itemToUpdate.lastVerificationDate = this.utilitiesService.getLocalDate();
        } else {
          logTypeID = 7;
          itemToUpdate.lastSelfCheckID = Number(verificationRes.data.id);
          itemToUpdate.lastSelfCheckDate = this.utilitiesService.getLocalDate();
        }

        const logEvent = this.utilitiesService.createNewLogEventForItem(
          baseItem.getItemType().id,
          logTypeID,
          baseItem.getItem(),
          this.user,
          baseItem.getNumber()
        );

        if (baseItem.isCard()) {
          this.httpService.httpPut<Card>('updateCard/', { cardItem: itemToUpdate, logEvent: logEvent }).then(cardRes => {
            if (cardRes.message === 'success') {
              if (this.user.userType.id == 1) {
                this.utilitiesService.updateLogEventList(cardRes.data.logEvent);
              }
              // So we don't adjust for timezone twice for dates not received from server
              if (isVerification) {
                itemToUpdate.lastVerificationDate = new Date();
              } else {
                itemToUpdate.lastSelfCheckDate = new Date();
              }
            }
          });
        } else {
          this.httpService.httpPut<Document>('updateDocument/', { documentItem: itemToUpdate, logEvent: logEvent }).then(documentRes => {
            if (documentRes.message === 'success') {
              if (this.user.userType.id == 1) {
                this.utilitiesService.updateLogEventList(documentRes.data.logEvent);
              }
              // So we don't adjust for timezone twice for dates not received from server
              if (isVerification) {
                itemToUpdate.lastVerificationDate = new Date();
              } else {
                itemToUpdate.lastSelfCheckDate = new Date();
              }
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
