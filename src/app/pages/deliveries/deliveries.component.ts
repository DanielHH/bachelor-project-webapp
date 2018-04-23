import { Component, OnInit } from '@angular/core';
import { Delivery } from '../../datamodels/delivery';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  deliveryList: Delivery[] = [];

  constructor(public dataService: DataService) {
    this.dataService.deliveryList.subscribe(deliveryList => {
      this.deliveryList = deliveryList;
    });
  }

  ngOnInit() {}
}
