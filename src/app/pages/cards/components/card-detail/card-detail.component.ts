import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Card } from '../../../../datamodels/card';

import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { RouteDataService } from '../../../../services/route-data.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  cardDetail: Card;

  constructor(private routeDataService: RouteDataService) {
    this.routeDataService.card.subscribe((card) => {
      this.cardDetail = card;
    });

  }

  ngOnInit(): void {
  }

}
