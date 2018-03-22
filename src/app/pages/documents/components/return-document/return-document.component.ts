import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Receipt } from '../../../../datamodels/receipt';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';
import { ReturnService } from '../../../../services/return.service';

@Component({
  selector: 'app-return-document',
  templateUrl: './return-document.component.html',
  styleUrls: ['./return-document.component.scss']
})
export class ReturnDocumentComponent implements OnInit {

  @ViewChild('returnForm') returnForm: NgForm;

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

  documents: Document[] = [];
  receipts: Receipt[] = [];

  documentItem: Document = null;

  locationControl = new FormControl('', Validators.required);

  locationInput = '';

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private returnService: ReturnService
  ) {
    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });

    this.returnService.document.subscribe((document) => {
      if (document && document.id) {
        this.documentItem = document;

        // this.startDateInput = moment(utilitiesService.getLocalDate).format('YYYY-MM-DD');
        // this.startDateDatepickerInput = this.docDateInput;

        this._showModal = true;

      }
    });
  }

  ngOnInit() {
  }

  /**
   * Returns receipts from id
   * @param id Id of receipt
   */
  getReceipt(id: number) {
    console.log(id);
    return _.find(this.receipts, (receipt) => receipt.id === id);
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Change status of a document to returned and update receipt
   */
  returnDocument() {
    if (this.isValidLocation()) {
      this.documentItem.userID = null;
      this.documentItem.location = this.locationInput;
      this.documentItem.status = 1; // TODO: ENUM FOR STATUS, 1 = Returned

      const activeReceipt = this.getReceipt(this.documentItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      this.httpService.httpPut<Receipt>('updateReceipt/', activeReceipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          this.documentItem.activeReceipt = null;

          this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(documentRes => {
            if (documentRes.message === 'success') {
              // Update receipt list
              this.receipts = this.receipts.slice();
              this.dataService.receiptList.next(this.receipts);

              // Update document list
              this.dataService.documentList.next(this.documents);

              this.showModal = false;
            }
          });
        }
      });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.returnForm.resetForm(); // Clears form errors

    this.documentItem = Object.assign({}, new Document());
    this.returnService.document.next(this.documentItem);

    this.showModal = false;
  }

}
