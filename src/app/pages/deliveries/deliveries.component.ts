import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Delivery } from '../../datamodels/delivery';
import _ = require('lodash');

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  deliveryList: Delivery[] = [];

  constructor(public dataService: DataService) {
    this.dataService.deliveryList.subscribe( (deliveryList) => {
      this.deliveryList = deliveryList;

    });

  }

  ngOnInit() {
  }

}
