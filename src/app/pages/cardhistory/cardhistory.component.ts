import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../../datamodels/card';
import { LogEvent } from '../../datamodels/logEvent';
import { DataService } from '../../services/data.service';
import { RouteDataService } from '../../services/route-data.service';

@Component({
  selector: 'app-cardhistory',
  templateUrl: './cardhistory.component.html',
  styleUrls: ['./cardhistory.component.scss']
})
export class CardHistoryComponent implements OnInit {
  logEventList: LogEvent[] = [];
  filteredLogEventList: LogEvent[] = [];
  card: Card;

  constructor(public dataService: DataService, private routeDataService: RouteDataService) {
    this.routeDataService.card.subscribe(card => {
      this.card = card;
      if (this.logEventList) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.card && logEvent.card.id) {
            return logEvent.card.id == this.card.id;
          }
          return false;
        });
      }
    });
    this.dataService.logEventList.subscribe(logEventList => {
      this.logEventList = logEventList;
      if (this.card && this.card.id) {
        this.filteredLogEventList = _.filter(this.logEventList, logEvent => {
          if (logEvent.card && logEvent.card.id) {
            return logEvent.card.id == this.card.id;
          }
          return false;
        });
      }
    });
  }

  ngOnInit() {}
}
