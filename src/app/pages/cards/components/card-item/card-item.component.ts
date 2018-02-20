import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import * as moment from 'moment';

@Component({
  selector: '[app-card-item]',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input() cardItem: Card;

  constructor() { }

  ngOnInit() {
    this.cardItem.displayedDate = moment(this.cardItem.expirationDate).format('YYYY-MM-DD');
  }

}
