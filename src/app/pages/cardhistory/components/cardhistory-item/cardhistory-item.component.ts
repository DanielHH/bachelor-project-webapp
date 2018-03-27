import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../../datamodels/receipt';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DocumentType } from '../../../../datamodels/documentType';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as moment from 'moment';
import { RouteDataService } from '../../../../services/route-data.service';

@Component({
  selector: 'app-cardhistory-item',
  templateUrl: './cardhistory-item.component.html',
  styleUrls: ['./cardhistory-item.component.scss']
})
export class CardhistoryItemComponent implements OnInit {

  @Input() receiptItem: Receipt;
  cardList: Card[] = [];
  documentList: Document[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  itemActive: boolean;

  cardDetail: Card;

  constructor(
    private routeDataService: RouteDataService,
    public utilitiesService: UtilitiesService) {
    this.routeDataService.card.subscribe((card) => {
      this.cardDetail = card;
    });
  }

  ngOnInit() {
    // get actual data to be displayed
    [this.itemIDToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay] =
      this.utilitiesService.getReceiptDisplay(this.receiptItem);
  }

  /**
   * Returns a string representation of the displayedStartDate of the card
   */
  displayStartDate() {
    return moment(this.receiptItem.startDate).format('YYYY-MM-DD HH:mm:ss');
  }

}
