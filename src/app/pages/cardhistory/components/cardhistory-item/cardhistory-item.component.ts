import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { LogEvent } from '../../../../datamodels/logEvent';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-cardhistory-item',
  templateUrl: './cardhistory-item.component.html',
  styleUrls: ['./cardhistory-item.component.scss']
})
export class CardhistoryItemComponent implements OnInit {
  @Input() logEventItem: LogEvent;

  cardDetail: Card;

  constructor(private routeDataService: RouteDataService, public utilitiesService: UtilitiesService) {
    this.routeDataService.card.subscribe(card => {
      this.cardDetail = card;
    });
  }

  ngOnInit() {}
}
