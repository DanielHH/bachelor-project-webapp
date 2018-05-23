import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { LogEvent } from '../../../../datamodels/logEvent';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-document-history-item',
  templateUrl: './document-history-item.component.html',
  styleUrls: ['./document-history-item.component.scss']
})
export class DocumentHistoryItemComponent implements OnInit, OnDestroy {
  @Input() logEventItem: LogEvent;

  documentDetail: Document;

  routeDataServiceSubscriber: any;

  constructor(private routeDataService: RouteDataService, public utilitiesService: UtilitiesService) {
    this.routeDataServiceSubscriber = this.routeDataService.document.subscribe(document => {
      this.documentDetail = document;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeDataServiceSubscriber.unsubscribe();
  }
}
