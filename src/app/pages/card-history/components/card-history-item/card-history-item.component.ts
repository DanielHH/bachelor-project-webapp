import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { LogEvent } from '../../../../datamodels/logEvent';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-card-history-item',
  templateUrl: './card-history-item.component.html',
  styleUrls: ['./card-history-item.component.scss']
})
export class CardHistoryItemComponent implements OnInit, OnDestroy {
  @Input() logEventItem: LogEvent;

  cardDetail: Card;

  routeDataServiceSubscriber: any;

  constructor(private routeDataService: RouteDataService, public utilitiesService: UtilitiesService) {
    this.routeDataServiceSubscriber = this.routeDataService.card.subscribe(card => {
      this.cardDetail = card;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeDataServiceSubscriber.unsubscribe();
  }
}
