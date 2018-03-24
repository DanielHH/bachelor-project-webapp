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

  itemTypeToDisplay: string;
  itemIDToDisplay: string;
  itemUserNameToDisplay: string;

  itemActive: boolean;

  constructor(private utilitiesService: UtilitiesService) {
  }

  ngOnInit() {
    // get actual data to be displayed
    [this.itemIDToDisplay, this.itemTypeToDisplay, this.itemUserNameToDisplay] =
      this.utilitiesService.getReceiptDisplay(this.receiptItem);

    this.setActiveReceipt();
  }

  /**
   * Set the receipt to be active or not depending on if end date exists
   */
  setActiveReceipt() {
    this.itemActive = (this.receiptItem.endDate == null);
  }

  /**
   * Returns a string representation of the displayedStartDate of the card
   */
  displayStartDate() {
    return moment(this.receiptItem.startDate).format('YYYY-MM-DD');
  }

   /**
   * Returns a string representation of the displayedEndDate of the card
   */
  displayEndDate() {
    if (this.receiptItem.endDate != null) {
      return moment(this.receiptItem.endDate).format('YYYY-MM-DD');
    }

  }

}
