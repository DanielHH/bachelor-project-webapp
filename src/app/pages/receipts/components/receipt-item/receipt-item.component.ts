import { Component, OnInit, Input } from '@angular/core';
import { Receipt } from '../../../../datamodels/receipt';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DocumentType } from '../../../../datamodels/documentType';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as moment from 'moment';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';

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

  itemActive: boolean;

  constructor(
    public utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    if (this.receiptItem.card) {
      this.itemTypeToDisplay = this.receiptItem.card.cardType.name;
      this.itemIDToDisplay = this.receiptItem.card.cardNumber;
    } else if (this.receiptItem.document) {
      this.itemTypeToDisplay = this.receiptItem.document.documentType.name;
      this.itemIDToDisplay = this.receiptItem.document.documentNumber;
    }

    this.itemActive = this.receiptItem.endDate == null;
  }

  /**
   * Shows the modal for receipt details
   */
  showDetailsModal() {
    this.modalService.detailReceipt.next(this.receiptItem);
  }


  openPDF() {
    if (this.receiptItem.url) {
      window.open(this.receiptItem.url, '_blank');
    }
  }

}
