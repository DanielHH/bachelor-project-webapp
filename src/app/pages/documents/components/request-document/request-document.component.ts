import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Document } from '../../../../datamodels/document';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../../../services/data.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import { User } from '../../../../datamodels/user';
import { Receipt } from '../../../../datamodels/receipt';
import { RequestService } from '../../../../services/request.service';
import * as moment from 'moment';

@Component({
  selector: 'app-request-document',
  templateUrl: './request-document.component.html',
  styleUrls: ['./request-document.component.scss']
})
export class RequestDocumentComponent implements OnInit {

  @ViewChild('requestForm') requestForm: NgForm;

  @Input() documentItem: Document = null; // Document that is requested


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

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges.pipe(
    startWith(''),
    map(val => this.filterUsers(val))
  );

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private requestService: RequestService
  ) {
    // User list subscriber
    this.dataService.userList.subscribe(users => {
      this.users = users;
      this.usernameControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    // Receipt list subscriber
    this.dataService.receiptList.subscribe(receipts => {
      this.receipts = receipts;
    });

    // Document list subscriber
    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });

    // Request document subscriber
    this.requestService.document.subscribe((document) => {
      if (document && document.id) {
        this.documentItem = document;

        this.startDateInput = utilitiesService.getDateString(utilitiesService.getLocalDate());
        this.startDateDatepickerInput = this.startDateInput;
        this.commentInput = this.documentItem.comment;
        this.generatePDF = true;

        this._showModal = true;

      }
    });
  }

  ngOnInit() {
  }

  /**
   * Filters list of usernames based on username input
   * @param str username input
   */
  filterUsers(str: string) {
    return this.users.filter(
      user =>
        str && typeof str === 'string' &&
        user.username.toLowerCase().indexOf(str.toLowerCase()) === 0

    );
  }

  /**
   * Sets the start date datePicker the date entered in the input field.
   */
  setStartDateToDatePicker() {
    if (
      !this.startDateControl.hasError('required') &&
      !this.startDateControl.hasError('startDate')
    ) {
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
    return (
      !this.usernameControl.hasError('required') &&
      !this.usernameControl.hasError('username')
    );
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
    return !this.startDateControl.hasError('required') &&
      !this.startDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidUsername() &&
      this.isValidLocation() &&
      this.isValidStartDate()
    );
  }

  /**
   * Update requested document, create receipt and submit to database.
   */
  requestDocument() {
    if (this.isValidInput()) {
      this.documentItem.user = this.usernameInput;
      this.documentItem.location = this.locationInput;
      this.documentItem.status = this.utilitiesService.getStatusFromID(2); // TODO: ENUM FOR STATUS, 2 = Requested

      // Set document information
      this.documentItem.modifiedDate = this.utilitiesService.getLocalDate();

      // Create new receipt
      const receipt = new Receipt();
      receipt.itemTypeID = 2; // TODO: ENUM, 2 means document
      receipt.documentID = this.documentItem.id;
      receipt.userID = this.documentItem.user.id;
      receipt.startDate = this.utilitiesService.getLocalDate();

      // Submit changes to database
      this.httpService.httpPost<Receipt>('addNewReceipt/', receipt).then(receiptRes => {
        if (receiptRes.message === 'success') {
          this.documentItem.activeReceipt = receiptRes.data.id;

          this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(documentRes => {
            if (documentRes.message === 'success') {
              // Update receipt list
              this.receipts.unshift(receiptRes.data);
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
    this.usernameControl.reset();
    this.locationControl.reset();
    this.requestForm.resetForm();

    this.documentItem = Object.assign({}, new Document());
    this.requestService.document.next(this.documentItem);

    this.showModal = false;
  }

  displayUser(user?: User) {
    return user ? user.username : '';
  }

}
