import { Component, OnInit } from '@angular/core';
import { Card } from '../../datamodels/card';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {


  cardList: Card[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe((cardList) => {
      this.cardList = cardList;
    });

  }


  ngOnInit() {
  }

}
