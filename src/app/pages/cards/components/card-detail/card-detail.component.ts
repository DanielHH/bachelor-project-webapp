import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

import { Card } from '../../../../datamodels/card';

import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  @Input() cardDetail: Card;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.getCardNumber();
  }

  getCardNumber(): void {
    const cardNumber = +this.route.snapshot.paramMap.get('cardNumber');
  }

  getRoute(): string {
    const segments: UrlSegment[] = this.route.snapshot.url;
    return segments[1].path;
  }

}
