import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { BaseItem } from '../../../../datamodels/baseItem';
import * as _ from 'lodash';
import { ModifyCardComponent } from '../../../cards/components/modify-card/modify-card.component';
import { NgForm } from '@angular/forms';
import { MatchFilterCardPipe } from '../../../../pipes/match-filter-card.pipe';
import { MatchFilterDocumentPipe } from '../../../../pipes/match-filter-document.pipe';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  @Input() baseItemList: BaseItem[];

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

  constructor(
    private cardPipe: MatchFilterCardPipe,
    private docPipe: MatchFilterDocumentPipe
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after modifiedDate ascending
   */
  sortTableListStart() {
    this.baseItemList = _.orderBy(this.baseItemList, ['subType'], ['desc']);
  }

  /**
   * Sorts the table depending on the property of the Card
   * @param property
   */
  sortTableList(property: string) {
    let newOrder = '';
    let orderFunc = (item: BaseItem) => '';
    switch (property) {
      case 'itemType':
        newOrder = this.sortTableListHelper(this.orderItemType);
        this.orderItemType = newOrder;
        orderFunc = (item: BaseItem) => item.itemType;
        break;
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
        orderFunc = (item: BaseItem) => item.getUser().name;
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
      case 'verifyDate': {
        // TODO
        break;
      }
    }
    if (newOrder) {
      this.baseItemList = _.orderBy(
        this.baseItemList,
        [
          orderFunc
        ],
        [newOrder]
      );
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



  /**
   * Detect if the given item should be filtered or not,
   * depending on checked boxes and input of filter field.
   * @returns true if the item should be displayed, false otherwise
   */
  passesFilter(baseItem: BaseItem): boolean {
    if (baseItem.isCard()) {
      return this.cardPipe.matchFilt(
        baseItem.item as Card,
        this.filterInput,
        this.showIn,
        this.showOut,
        this.showArchived,
        this.showGone
      );
    } else {
      return this.docPipe.matchFilt(
        baseItem.item as Document,
        this.filterInput,
        this.showIn,
        this.showOut,
        this.showArchived,
        this.showGone
      );
    }
  }
}
