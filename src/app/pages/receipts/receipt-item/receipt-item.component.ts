import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../datamodels/receipt';
import { DataService } from '../../../services/data.service';
import { CardType } from '../../../datamodels/cardType';
import { Card } from '../../../datamodels/card';
import { Document } from '../../../datamodels/document';
import { User } from '../../../datamodels/user';
import { DocumentType } from '../../../datamodels/documentType';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../services/utilities.service';
import * as moment from 'moment';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-receipt-item',
  templateUrl: './receipt-item.component.html',
  styleUrls: ['./receipt-item.component.scss']
})
export class ReceiptItemComponent implements OnInit {

  @Input() receiptItem: Receipt;

  cardList: Card[] = [];
  documentList: Document[] = [];
  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  itemKindToDisplay: string;
  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  itemActive: boolean;

  constructor(public utilitiesService: UtilitiesService, private httpService: HttpService) {
  }

  ngOnInit() {
    // get actual data to be displayed
    [this.itemIDToDisplay, this.itemKindToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay] =
      this.utilitiesService.getReceiptDisplay(this.receiptItem);

    this.setActiveReceipt();
  }

  /**
   * Set the receipt to be active or not depending on if end date exists
   */
  setActiveReceipt() {
    this.itemActive = (this.receiptItem.endDate == null);
  }

  genPDF() {
    this.httpService.httpPDF(this.utilitiesService.getPDFParams(this.receiptItem));
    delay(this.httpService);

    async function delay(httpService: HttpService) {
      await sleep(2000);
      httpService.httpGetPDF();
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

}
