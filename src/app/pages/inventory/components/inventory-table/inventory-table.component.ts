import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
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

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  @Input() baseItemList: BaseItem[];
  @ViewChildren(InventoryItemComponent) displayedItems: QueryList<InventoryItemComponent>;

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

  isChecked = false;

  constructor(
    private inventoryPipe: MatchFilterInventoryPipe,
    private utilitiesService: UtilitiesService,
    private httpService: HttpService
  ) {}

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
        orderFunc = (item: BaseItem) => item.getStatus().name;
        break;
      }
      case 'subType': {
        newOrder = this.sortTableListHelper(this.orderSubType);
        this.orderSubType = newOrder;
        orderFunc = (item: BaseItem) => item.getSubType().name;
        break;
      }
      case 'number': {
        newOrder = this.sortTableListHelper(this.orderNumber);
        this.orderNumber = newOrder;
        orderFunc = (item: BaseItem) => item.getNumber();
        break;
      }
      case 'user': {
        newOrder = this.sortTableListHelper(this.orderUser);
        this.orderUser = newOrder;
        orderFunc = (item: BaseItem) => this.utilitiesService.getUserString(item.getUser());
        break;
      }
      case 'location': {
        newOrder = this.sortTableListHelper(this.orderLocation);
        this.orderLocation = newOrder;
        orderFunc = (item: BaseItem) => item.getLocation();
        break;
      }
      case 'comment': {
        newOrder = this.sortTableListHelper(this.orderComment);
        this.orderComment = newOrder;
        orderFunc = (item: BaseItem) => item.getComment();
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

  genPDF() {

    const filteredList = this.inventoryPipe.transform(
      this.baseItemList,
      this.filterInput,
      this.showIn,
      this.showOut,
      this.showArchived,
      this.showGone
    );

    const verificationList = [];
    let verification: Verification;

    this.displayedItems.forEach(item => {
      if (item.isChecked && _.includes(filteredList, item.baseItem)) {
        verification = new Verification();
        const baseItem = item.baseItem;
        if (baseItem.isCard()) {
          verification.card = baseItem.item as Card;
          verification.itemType = this.utilitiesService.getItemTypeFromID(1);
        } else {
          verification.document = baseItem.item as Document;
          verification.itemType = this.utilitiesService.getItemTypeFromID(2);
        }

        verification.verificationType = this.utilitiesService.getVerificationTypeFromID(2);
        verification.user = baseItem.getItem().user;
        verification.verificationDate = baseItem.getItem().lastVerificationDate;

        verificationList.push(verification);
      }
    });

    /*filteredList.forEach(baseItem => {
      verification = new Verification();
      if (baseItem.isCard()) {
        verification.card = baseItem.item as Card;
        verification.itemType = this.utilitiesService.getItemTypeFromID(1);
      } else {
        verification.document = baseItem.item as Document;
        verification.itemType = this.utilitiesService.getItemTypeFromID(2);
      }

      verification.verificationType = this.utilitiesService.getVerificationTypeFromID(2);
      verification.user = baseItem.getItem().user;
      verification.verificationDate = baseItem.getItem().lastVerificationDate;

      verificationList.push(verification);
    });*/

    const filters = [[this.filterInput, this.filterInput], ['Tillgängliga', this.showIn], ['Utkvitterade', this.showOut],
                     ['Arkiverade', this.showArchived], ['Borttappade', this.showGone]];

    this.httpService.httpPost<any>('genPDF', ['inventory', verificationList, filters] ).then(pdfRes => {
      if (pdfRes.message === 'success') {
        this.url = pdfRes.url;
      }
    });
  }

  openPDF() {
    window.open(this.url, '_blank');
  }
  /**
   * Update verification date for all checked items.
  */
  sendVerify(): void {
    // TODO: should send a single post containing all verifications
    this.displayedItems.forEach(item => {
      if (item.isChecked) {
        item.verifyInventory();
      }
    });
  }

  generatePDF(): void {
    // todo
    this.genPDF();
  }

  changeItems() {
    this.displayedItems.forEach(item => {
      item.isChecked = this.isChecked;
    });
  }
}
