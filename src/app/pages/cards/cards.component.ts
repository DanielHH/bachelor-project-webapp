import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  cardList: Card[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe(cardList => {
      this.cardList = cardList;
    });
  }

  ngOnInit() {}
}
