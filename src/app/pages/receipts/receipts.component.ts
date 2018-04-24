import { Component, OnDestroy, OnInit } from '@angular/core';
import { Receipt } from '../../datamodels/receipt';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit, OnDestroy {
  receiptList: Receipt[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.receiptList.subscribe(receiptList => {
      this.receiptList = receiptList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
