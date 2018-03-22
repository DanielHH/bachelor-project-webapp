import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Receipt } from '../../../../datamodels/receipt';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-return-document',
  templateUrl: './return-document.component.html',
  styleUrls: ['./return-document.component.scss']
})
export class ReturnDocumentComponent implements OnInit {

  @ViewChild('returnForm') returnForm: NgForm;

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.closeForm();
  }

  documents: Document[] = [];
  receipts: Receipt[] = [];

  documentItem: Document = null;

  /**
   * Set document that is being returned.
   */
  @Input('document') set document(document: Document) {
    if (document && document.id) {
      this.documentItem = document;
    }
  }

  locationControl = new FormControl('', Validators.required);

  locationInput = '';

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
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
    console.log(this.receipts);
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
          this.dataService.receiptList.next(this.receipts);
          this.documentItem.activeReceipt = null;

          this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(documentRes => {
            if (documentRes.message === 'success') {
              this.dataService.documentList.next(this.documents);
              this.closeForm();
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
    this.returnForm.resetForm();
    this.documentItem = Object.assign({}, new Document());
    this.showModal = false;
    this.showModalChange.emit(false);
  }

}
