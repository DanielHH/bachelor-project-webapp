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
  docDateInput = '';
  docDateDatepickerInput = '';
  locationInput = '';
  commentInput = '';
  addDocHolder: Boolean = false;
  usernameInput = '';

  // Form Controls
  docTypeControl = new FormControl('', Validators.required);
  docNumberControl = new FormControl('', Validators.required);
  docNameControl = new FormControl('', Validators.required);
  usernameControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
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

  constructor(public dialogRef: MatDialogRef<ModifyDocumentComponent>,
      private httpService: HttpService, public dataService: DataService,
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
   * Close modify document dialog
  */
  closeDialog() {
    this.dialogRef.close();
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
   * Attempts to submit new document to database and returns true if successful, else false
  */
  addNewDoc(): Boolean {
    if (this.isValidInput()) {
      const doc = new Document();

      doc.documentType = this.getDocTypeID(this.docTypeInput);
      doc.documentNumber = this.docNumberInput;
      doc.name = this.nameInput;
      doc.location = this.locationInput;
      doc.documentDate = new Date(this.docDateInput);
      doc.creationDate = this.utilitiesService.getLocalDate();
      doc.modifiedDate = this.utilitiesService.getLocalDate();
      doc.comment = this.commentInput;
      doc.status = 1;

      if (this.addDocHolder && this.isValidUsername()) {
        doc.userID = this.getUserID(this.usernameInput);
      } else {
        doc.userID = null;
      }

      this.httpService.httpPost<Document>('addNewDocument/', doc).then(res => {
        console.log(res.data);
      });

      return true;
    }
    return false;
  }

  /**
   * Returns the id associated with docTypeName
   * @param docTypeName Name of doc type
   */
  getDocTypeID(docTypeName: String) {
    return _.find(this.docTypes, (docType) => docType.name === docTypeName).id;
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
    return !this.docNameControl.hasError('required');
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

}
