import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../../../../datamodels/user';
import { Receipt } from '../../../../datamodels/receipt';
import { UtilitiesService } from '../../../../services/utilities.service';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';
import { ModalService } from '../../../../services/modal.service';
import { AuthService } from '../../../../auth/auth.service';

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

  user: User;
  documentItem: Document = null;
  documents: Document[] = [];
  receipts: Receipt[] = [];

  latestUser: User = null;

  locationControl = new FormControl('', Validators.required);

  locationInput = '';
  commentInput = null;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private authService: AuthService
  ) {

    this.authService.user.subscribe((user) => {
      this.user = user;
    });

    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });

    this.modalService.returnDocument.subscribe((document) => {
      if (document && document.id) {
        this.documentItem = document;
        this.commentInput = document.comment;

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
    return _.find(this.receipts, (receipt) => receipt.id == id);
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
      // Save latestUser for LogEvent
      this.latestUser = this.documentItem.user;

      this.documentItem.user = new User();
      this.documentItem.location = this.locationInput;
      this.documentItem.comment = this.commentInput != '' ? this.commentInput : null;
      this.documentItem.status = this.utilitiesService.getStatusFromID(1); // TODO: ENUM FOR STATUS, 1 = Returned
      this.documentItem.modifiedDate = this.utilitiesService.getLocalDate();

      const activeReceipt = this.getReceipt(this.documentItem.activeReceipt);
      activeReceipt.endDate = this.utilitiesService.getLocalDate();

      // Create new log event
      const logEvent = this.utilitiesService.createNewLogEventForItem(2, 4, this.documentItem, this.user, this.latestUser.name);

      this.httpService.httpPut<Receipt>('updateReceipt/', {
        receipt: activeReceipt,
        logEvent: logEvent,
        document: this.documentItem})
        .then(res => {
        if (res.message === 'success') {
          this.documentItem.activeReceipt = null;
            // Update log event list
            this.utilitiesService.updateLogEventList(res.data.logEvent);

              // Update receipt list
              this.receipts = this.receipts.slice();
              this.dataService.receiptList.next(this.receipts);

              // Update document list
              this.dataService.documentList.next(this.documents);

              this.showModal = false;
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
    this.commentInput = null;
    this.returnForm.resetForm(); // Clears form errors

    this.documentItem = Object.assign({}, new Document());
    this.modalService.returnDocument.next(this.documentItem);

    this.showModal = false;
  }

  getDateString(str: Date) {
    if (str) {
      return this.utilitiesService.getDateString(str);
    }
  }

}
