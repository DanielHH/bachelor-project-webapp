import { Component, OnInit } from '@angular/core';
import { Receipt } from '../../datamodels/receipt';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {

  receiptList: Receipt[] = [];

  constructor(public dataService: DataService) {
    this.dataService.receiptList.subscribe((receiptList) => {
      this.receiptList = receiptList;
    });
   }

  ngOnInit() {
  }

}
