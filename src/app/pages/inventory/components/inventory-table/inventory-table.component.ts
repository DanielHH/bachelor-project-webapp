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
import { lowerCase, UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  @Input() baseItemList: BaseItem[];

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

  constructor(
    private cardPipe: MatchFilterCardPipe,
    private docPipe: MatchFilterDocumentPipe,
    private utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    this.sortTableListStart();
  }

  /**
   * Sorts table after subType ascending
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
      case 'verifyDate': {
        newOrder = this.sortTableListHelper(this.orderVerifyDate);
        this.orderVerifyDate = newOrder;
        orderFunc = (item: BaseItem) => String(item.getLastVerifiedString());
        break;
      }
    }
    if (newOrder) {
      this.baseItemList = _.orderBy(
        this.baseItemList,
        [orderFunc],
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
}
