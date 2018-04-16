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
import { LogEvent } from '../../../../datamodels/logEvent';

@Component({
  selector: 'app-cardhistory-item',
  templateUrl: './cardhistory-item.component.html',
  styleUrls: ['./cardhistory-item.component.scss']
})
export class CardhistoryItemComponent implements OnInit {

  @Input() logEventItem: LogEvent;
  // cardList: Card[] = [];
/*
  logDate: string;
  logType: string;
  eventToDisplay: string;
  userToDisplay: string;
*/
  cardDetail: Card;

  constructor(
    private routeDataService: RouteDataService,
    public utilitiesService: UtilitiesService) {
    this.routeDataService.card.subscribe((card) => {
      this.cardDetail = card;
    });
  }

  ngOnInit() {
    /*if (this.logEventItem.itemType.id === 1 && this.logEventItem.card.id === this.cardDetail.id &&
      this.logEventItem.logType.id === 5) { // show requested cards
      this.logDate = moment(this.logEventItem.logDate).format('YYYY-MM-DD HH:mm:ss');
      this.logType = this.logEventItem.logType.name;
      this.eventToDisplay = this.logEventItem.logText;
      } else if (this.logEventItem.itemType.id === 1 && this.logEventItem.card.id === this.cardDetail.id &&
      this.logEventItem.logType.id === 4) { // show returned cards
        this.logDate = moment(this.logEventItem.logDate).format('YYYY-MM-DD HH:mm:ss');
        this.logType = this.logEventItem.logType.name;
        this.eventToDisplay = this.logEventItem.logText;
      }*/
  }
}
