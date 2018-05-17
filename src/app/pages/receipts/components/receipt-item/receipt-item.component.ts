import { Component, Input, OnInit } from '@angular/core';
import { Receipt } from '../../../../datamodels/receipt';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-receipt-item',
  templateUrl: './receipt-item.component.html',
  styleUrls: ['./receipt-item.component.scss']
})
export class ReceiptItemComponent implements OnInit {
  @Input() receiptItem: Receipt;

  itemTypeToDisplay: string;
  itemIDToDisplay: string;

  itemActive: boolean;

  itemType: string;

  item: any;

  constructor(private modalService: ModalService, private httpService: HttpService) {}

  ngOnInit() {
    if (this.receiptItem.card) {
      this.itemTypeToDisplay = this.receiptItem.card.cardType.name;
      this.itemIDToDisplay = this.receiptItem.card.cardNumber;
      this.itemType = 'card';
      this.item = this.receiptItem.card;
    } else if (this.receiptItem.document) {
      this.itemTypeToDisplay = this.receiptItem.document.documentType.name;
      this.itemIDToDisplay = this.receiptItem.document.documentNumber;
      this.itemType = 'document';
      this.item = this.receiptItem.document;
    }

    this.itemActive = this.receiptItem.endDate == null;
  }

  /**
   * Shows the modal for receipt details
   */
  showDetailsModal() {
    this.modalService.detailReceipt.next(this.receiptItem);
  }

  genPDF() {
    this.httpService.httpPost<any>('genPDF', [this.itemType, this.item, this.receiptItem]).then(pdfRes => {
      if (pdfRes.message === 'success') {
        this.receiptItem.url = pdfRes.url;
      }
    });
  }

  openPDF() {
    if (this.receiptItem.url) {
      window.open(this.receiptItem.url, '_blank');
    }
  }

}
