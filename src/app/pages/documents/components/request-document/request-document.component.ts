import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { Document } from '../../../../datamodels/document';
import { Receipt } from '../../../../datamodels/receipt';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-request-document',
  templateUrl: './request-document.component.html',
  styleUrls: ['./request-document.component.scss']
})
export class RequestDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('requestForm') requestForm: NgForm;

  documentItem: Document = null; // Document that is requested

  @Output() modalClosed = new EventEmitter<boolean>();

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
  users = [];
  documents: Document[] = [];
  receipts: Receipt[] = [];

  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  startDateControl = new FormControl('', Validators.required);

  usernameInput: any;
  locationInput = '';
  startDateInput = '';
  startDateDatepickerInput = '';
  commentInput = '';

  generatePDF = true;

  loading = false;

  hideSubmit = false;

  closeText = 'Avbryt';

  pdfView = false;

  pdfURL = '';

  authServiceSubscriber: any;

  dataServiceUserSubscriber: any;

  dataServiceReceiptSubscriber: any;

  dataServiceDocumentSubscriber: any;

  modalServiceSubscriber: any;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    public utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    // User list subscriber
    this.dataServiceUserSubscriber = this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    // Receipt list subscriber
    this.dataServiceReceiptSubscriber = this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Document list subscriber
    this.dataServiceDocumentSubscriber = this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });

    // Request document subscriber
    this.modalServiceSubscriber = this.modalService.requestDocument.subscribe(document => {
      if (document && document.id) {
        this.documentItem = document;

        this.startDateInput = utilitiesService.getDateString(utilitiesService.getLocalDate());
        this.startDateDatepickerInput = this.startDateInput;
        this.generatePDF = true;

        this._showModal = true;

        // Textarea size does not update correctly if there is no delay on assignment becuase the textarea scrollheight
        // is 0 until after 200ms~ becuase of modal?
        setTimeout(() => {
          this.commentInput = this.documentItem.comment;
        }, 250);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();

    this.dataServiceUserSubscriber.unsubscribe();

    this.dataServiceReceiptSubscriber.unsubscribe();

    this.dataServiceDocumentSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Sets the start date datePicker the date entered in the input field.
   */
  setStartDateToDatePicker() {
    if (!this.startDateControl.hasError('required') && !this.startDateControl.hasError('startDate')) {
      this.startDateDatepickerInput = this.startDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets start date from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setStartDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.startDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Returns true if entered username is valid, else false.
   */
  isValidUsername() {
    return !this.usernameControl.hasError('required') && !this.usernameControl.hasError('username');
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered start date is valid, else false.
   */
  isValidStartDate() {
    return !this.startDateControl.hasError('required') && !this.startDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidUsername() && this.isValidLocation() && this.isValidStartDate();
  }

  /**
   * Update requested document, create receipt and submit to database.
   */
  requestDocument() {
    if (this.isValidInput()) {
      this.documentItem.user = this.usernameInput;
      this.documentItem.location = this.locationInput;
      this.documentItem.status = this.utilitiesService.getStatusFromID(2);
      this.documentItem.modifiedDate = this.utilitiesService.getLocalDate();
      this.documentItem.comment = this.commentInput;
      this.documentItem.registrator = this.user.name;

      // Create new receipt
      const receipt = new Receipt();
      receipt.itemType = this.utilitiesService.getItemTypeFromID(2);
      receipt.document = this.documentItem;
      receipt.card = null;
      receipt.user = this.documentItem.user;
      receipt.startDate = new Date(this.startDateInput);
      receipt.endDate = null;

      // Create new log event
      const logText = this.documentItem.documentNumber + ' till ' + this.documentItem.user.name;
      const logEvent = this.utilitiesService.
      createNewLogEventForItem(2, 2, this.documentItem, this.user, logText); // TODO: 2 = Document, 2 = Request

      // Submit changes to database
      this.httpService
        .httpPost<Receipt>('addNewReceipt/', { receipt: receipt, logEvent: logEvent})
        .then(res => {
          if (res.message === 'success') {
            const newReceipt = res.data.receipt;

            this.documentItem.activeReceiptID = Number(newReceipt.id);

            if (this.generatePDF) {
              this.loading = true;
              this.hideSubmit = true;
              this.closeText = 'Stäng';

              this.httpService.httpPost<any>('genPDF', ['document', this.documentItem, newReceipt]).then(pdfRes => {
                if (pdfRes.message === 'success') {
                  newReceipt.url = pdfRes.url;
                  this.loading = false;
                  this.pdfView = true;
                  this.pdfURL = newReceipt.url;
                  this.hideSubmit = true;
                  this.updateLists(res.data.logEvent, newReceipt);
                }
              });
            } else {
              this.updateLists(res.data.logEvent, newReceipt);
              this.closeForm();
            }
          }
        });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.usernameControl.reset();
    this.locationControl.reset();
    this.requestForm.resetForm();

    this.documentItem = Object.assign({}, new Document());
    this.modalService.requestDocument.next(this.documentItem);

    this.loading = false;
    this.hideSubmit = false;
    this.closeText = 'Avbryt';
    this.pdfView = false;
    this.pdfURL = '';

    this.showModal = false;
  }

  displayUser(user?: User) {
    return user ? user.username : '';
  }

  updateLists(logEvent: any, receipt: any) {
    // Update log event list
    this.utilitiesService.updateLogEventList(logEvent);

    // Update receipt list
    this.receipts.unshift(receipt);
    this.receipts = this.receipts.slice();
    this.dataService.receiptList.next(this.receipts);

    // Update card list
    this.dataService.documentList.next(this.documents);
  }
}
