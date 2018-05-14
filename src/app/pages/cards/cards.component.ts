import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from '../../datamodels/card';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
  cardList: Card[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
