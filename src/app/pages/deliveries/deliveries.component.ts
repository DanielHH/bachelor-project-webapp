import { Component, OnInit, OnDestroy } from '@angular/core';
import { Delivery } from '../../datamodels/delivery';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit, OnDestroy {
  deliveryList: Delivery[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.deliveryList.subscribe(deliveryList => {
      this.deliveryList = deliveryList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
