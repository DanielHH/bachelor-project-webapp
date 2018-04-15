import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Receipt } from '../../../../datamodels/receipt';

@Component({
  selector: 'app-receipt-detail',
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.scss']
})
export class ReceiptDetailComponent implements OnInit {

  @ViewChild('detailForm') detailForm: NgForm;

  showModal = false;

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }

    this.showModal = value;
  }

  receiptItem: Receipt = null;

  typeToDisplay: string;
  idToDisplay: string;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailReceipt.subscribe((receipt) => {
      if (receipt && receipt.id) {
        this.receiptItem = receipt;

        if (this.receiptItem.card) {
          this.typeToDisplay = this.receiptItem.card.cardType.name;
          this.idToDisplay = this.receiptItem.card.cardNumber;
        } else if (this.receiptItem.document) {
          this.typeToDisplay = this.receiptItem.document.documentType.name;
          this.idToDisplay = this.receiptItem.document.documentNumber;
        }

        this._showModal = true;
      }
    });

  }
  ngOnInit() {
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.receiptItem = Object.assign({}, new Receipt());
    this.modalService.detailReceipt.next(this.receiptItem);

    this.showModal = false;
  }
}
