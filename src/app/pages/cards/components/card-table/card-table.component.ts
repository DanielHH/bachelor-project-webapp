import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../../datamodels/card';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  @Input() cardList: Card[];

  constructor() { }

  ngOnInit() {
  }

}
