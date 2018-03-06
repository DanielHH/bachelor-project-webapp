import { Component, OnInit, Input, Directive, Inject } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import { FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-modify-document',
  templateUrl: './modify-document.component.html',
  styleUrls: ['./modify-document.component.scss']
})
export class ModifyDocumentComponent implements OnInit {

  // Form variables
  docTypeInput = '';
  docNumberInput = '';
  nameInput = '';
  senderInput = '';
  registrationDateInput = '';
  registrationDateDatepickerInput = '';
  docDateInput = '';
  docDateDatepickerInput = '';
  locationInput = '';
  commentInput = '';
  addDocHolder: Boolean = false;
  usernameInput = '';

  // Form Controls
  docTypeControl = new FormControl('', Validators.required);
  docNumberControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  registrationDateControl = new FormControl('', Validators.required);
  registrationDatePickerControl = new FormControl();
  docDateControl = new FormControl('', Validators.required);
  docDatePickerControl = new FormControl();

  // Database data lists
  docTypes = [];
  users = [];

  // Filtered lists
  filteredDocTypes: Observable<any[]> = this.docTypeControl.valueChanges
  .pipe(
    startWith(''),
    map(docType => docType ? this.filterDocTypes(docType) : this.docTypes.slice())
  );

  filteredUsers: Observable<any[]> = this.usernameControl.valueChanges
    .pipe(
      startWith(''),
      map(val => this.filterUsers(val))
  );

  @Input() documentList: Document[];

  constructor(private httpService: HttpService,
      public dataService: DataService,
      private utilitiesService: UtilitiesService) {

    this.dataService.documentTypeList.subscribe( (docTypes) => {
      this.docTypes = docTypes;
    });

    this.dataService.userList.subscribe( (users) => {
      this.users = users;
    });
  }

  ngOnInit() {
  }

  /**
   * Filters list of docTypes based on docType input
   * @param str docType input
   */
  filterDocTypes(str: string) {
    return this.docTypes.filter(docType =>
      str != null && docType.name.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  /**
   * Filters list of usernames based on username input
   * @param str username input
   */
  filterUsers(str: string) {
    return this.users.filter(user =>
      str != null && user.username.toLowerCase().indexOf(str.toLowerCase()) === 0);
  }

  /**
   * Attempts to submit new document to database
  */
  addNewDocument(): Promise<any> {
    return new Promise(resolve => {

      if (this.isValidInput()) {
        const newDoc = new Document();

        newDoc.documentType = this.getDocTypeID(this.docTypeInput);
        newDoc.documentNumber = this.docNumberInput;
        newDoc.location = this.locationInput;
        newDoc.documentDate = new Date(this.docDateInput);
        newDoc.registrationDate = new Date(this.registrationDateInput);
        newDoc.creationDate = this.utilitiesService.getLocalDate();
        newDoc.modifiedDate = this.utilitiesService.getLocalDate();
        newDoc.comment = this.commentInput;
        newDoc.status = 1;

        if (this.addDocHolder && this.isValidUsername()) {
          newDoc.userID = this.getUserID(this.usernameInput);
        } else {
          newDoc.userID = null;
        }

        this.httpService.httpPost<Document>('addNewDocument/', newDoc).then(res => {
          if (res.message === 'success') {
            this.documentList.unshift(res.data);
            this.dataService.documentList.next(this.documentList);

            this.resetForm();
            resolve();
          }
        });
      }
    });
  }

  /**
   * Attempts to submit changes to a document to database
  */
  editDocument(): Promise<any> {
    return new Promise(resolve => {

      if (this.isValidInput()) {
        const editDoc = new Document();
        editDoc.documentType = this.getDocTypeID(this.docTypeInput);
        editDoc.documentNumber = this.docNumberInput;
        editDoc.location = this.locationInput;
        editDoc.documentDate = new Date(this.docDateInput);
        editDoc.registrationDate = new Date(this.registrationDateInput);
        editDoc.modifiedDate = this.utilitiesService.getLocalDate();
        editDoc.comment = this.commentInput;
        editDoc.status = 1;

        if (this.addDocHolder && this.isValidUsername()) {
          editDoc.userID = this.getUserID(this.usernameInput);
        } else {
          editDoc.userID = null;
        }

        this.httpService.httpPut<Document>('updateDocument/', editDoc).then(res => {
          if (res.message === 'success') {
            this.dataService.documentList.next(this.documentList);
            this.resetForm();
            resolve();
          }
        });
      }
    });
  }

  /**
   * Sets form to display given document.
   */
  setForm(document: Document): Promise<any> {
    return new Promise(resolve => {
      this.docTypeInput = _.find(this.docTypes, (docType) => docType.id === document.documentType).name;
      this.docNumberInput = document.documentNumber;
      this.nameInput = document.name;
      this.senderInput = document.sender;
      this.registrationDateInput = moment(document.registrationDate).format('YYYY-MM-DD');
      this.registrationDateDatepickerInput = this.registrationDateInput;
      this.docDateInput = moment(document.documentDate).format('YYYY-MM-DD');
      this.docDateDatepickerInput = this.docDateInput;
      this.locationInput = document.location;
      this.commentInput = document.comment;
      if (document.userID != null) {
        this.usernameInput = _.find(this.users, (user) => user.id === document.userID).name;
        this.addDocHolder = true;
      } else {
        this.usernameInput = '';
        this.addDocHolder = false;
      }
      resolve();
    });
  }

  /**
   * Returns the id associated with docTypeName
   * @param docTypeName Name of doc type
   */
  getDocTypeID(docTypeName: String) {
    return _.find(this.docTypes, (docType) => docType.name === docTypeName).name;
  }

  /**
   * Returns user id of user with username
   * @param username Username of user
   */
  getUserID(username: String) {
    return _.find(this.users, (user) => user.username === username).id;
  }

  /**
   * Sets the doc date datePicker the date entered in the input field.
  */
  setDocDateToDatePicker() {
    if (!this.docDateControl.hasError('required') && !this.docDateControl.hasError('dateFormat')) {
      this.docDateDatepickerInput = this.docDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets docDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setDocDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.docDateInput = moment(data.value).format('YYYY-MM-DD');
    }
  }

  /**
   * Returns true if entered document type is valid, else false.
  */
  isValidDocType() {
    return !this.docTypeControl.hasError('required') && !this.docTypeControl.hasError('docType');
  }

  /**
   * Returns true if entered document number is valid, else false.
  */
  isValidDocNumber() {
    return !this.docNumberControl.hasError('required');
  }

  /**
   * Returns true if entered document name is valid, else false.
  */
  isValidDocName() {
    return !this.nameControl.hasError('required');
  }

  /**
   * Returns true if entered username is valid, else false.
  */
  isValidUsername() {
    return !this.addDocHolder ||
      (!this.usernameControl.hasError('required') && !this.usernameControl.hasError('username'));
  }

  /**
   * Returns true if entered location is valid, else false.
  */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered document date is valid, else false.
  */
  isValidDocDate() {
    return !this.docDateControl.hasError('required') && !this.docDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
  */
  isValidInput() {
    return this.isValidDocType() && this.isValidDocNumber() && this.isValidDocName() &&
    this.isValidUsername() && this.isValidLocation() && this.isValidDocDate();
  }

  /**
   * Resets form by resetting form controls and clearing inputs
   */
  resetForm() {
    this.docTypeControl.reset();
    this.docNumberControl.reset();
    this.nameControl.reset();
    this.usernameControl.reset();
    this.locationControl.reset();
    this.docDateControl.reset();
    this.docDatePickerControl.reset();
    this.commentInput = '';
  }

}
