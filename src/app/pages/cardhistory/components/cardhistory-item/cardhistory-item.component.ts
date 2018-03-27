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

  logDate: string;
  eventToDisplay: string;
  userToDisplay: string;

  cardDetail: Card;

  constructor(
    private routeDataService: RouteDataService,
    public utilitiesService: UtilitiesService) {
    this.routeDataService.card.subscribe((card) => {
      this.cardDetail = card;
    });
  }

  ngOnInit() {
    if (this.receiptItem.itemTypeID == 1 && this.receiptItem.cardID == this.cardDetail.id && !this.receiptItem.endDate) {
      this.eventToDisplay = 'Kort utkvitterades till ' + this.cardDetail.user.username;
      this.logDate = moment(this.receiptItem.startDate).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}
