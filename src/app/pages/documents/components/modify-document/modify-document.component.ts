import { Component, OnInit, Input, Directive, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';
import { EditService } from '../../../../services/edit.service';

@Component({
  selector: 'app-modify-document',
  templateUrl: './modify-document.component.html',
  styleUrls: ['./modify-document.component.scss']
})
export class ModifyDocumentComponent implements OnInit {

  // Form variables
  docTypeInput = '';
  docNumberInput = '';

  registrationDateInput = '';
  registrationDateDatepickerInput = '';
  docDateInput = '';
  docDateDatepickerInput = '';

  nameInput = '';
  senderInput = '';

  locationInput = '';
  commentInput = null;

  // Form Controls
  docTypeControl = new FormControl('', Validators.required);
  docNumberControl = new FormControl('', Validators.required);

  registrationDateControl = new FormControl('', Validators.required);
  registrationDatePickerControl = new FormControl();
  docDateControl = new FormControl('', Validators.required);
  docDatePickerControl = new FormControl();

  nameControl = new FormControl('', Validators.required);
  senderControl = new FormControl('', Validators.required);

  locationControl = new FormControl('', Validators.required);

  // Database data lists
  docTypes = [];

  // Filtered lists
  filteredDocTypes: Observable<any[]> = this.docTypeControl.valueChanges
    .pipe(
      startWith(''),
      map(docType => docType ? this.filterDocTypes(docType) : this.docTypes.slice())
    );

  @Input() documentList: Document[];

  /**
   * Sets form to display given document.
   */
  @Input('document') set document(document: Document) {

  }

  @Input() modalTitle = '';

  @Input() modalType: number;

  @ViewChild('modifyForm') modifyForm: NgForm;

  @Input() showModal = false;

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }
    this.showModal = value;
  }

  documentItem: Document;

  @Output() showModalChange = new EventEmitter<any>();

  constructor(private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private editService: EditService) {

    this.dataService.documentTypeList.subscribe(docTypes => {
      this.docTypes = docTypes;
      this.docTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.editService.document.subscribe((document) => {
      if (document && document.id) {
        this.documentItem = document;

        this.docTypeInput = this.getDocTypeName(document.documentType);
        this.docNumberInput = document.documentNumber;

        this.registrationDateInput = moment(document.registrationDate).format('YYYY-MM-DD');
        this.registrationDateDatepickerInput = this.registrationDateInput;
        this.docDateInput = moment(document.documentDate).format('YYYY-MM-DD');
        this.docDateDatepickerInput = this.docDateInput;

        this.nameInput = document.name;
        this.senderInput = document.sender;

        this.locationInput = document.location;
        this.commentInput = document.comment;

        this._showModal = true;
        this.modalType = 1;

      }
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
   * Sets fields in document according to form
   * @param document Document to set form data to
   */
  setDocumentFromForm(document: Document) {
    if (this.isValidInput()) {
      document.documentType = this.getDocTypeID(this.docTypeInput);
      document.documentNumber = this.docNumberInput;

      document.documentDate = new Date(this.docDateInput);
      document.registrationDate = new Date(this.registrationDateInput);

      document.name = this.nameInput;
      document.sender = this.senderInput;

      document.location = this.locationInput;
      document.comment = this.commentInput;

      document.modifiedDate = this.utilitiesService.getLocalDate();
    }
  }

  /**
   * Attempts to submit new document to database
  */
  addNewDocument() {
    if (this.isValidInput()) {
      const newDoc = new Document();

      this.setDocumentFromForm(newDoc);

      newDoc.creationDate = this.utilitiesService.getLocalDate();
      newDoc.status = 1;

      this.httpService.httpPost<Document>('addNewDocument/', newDoc).then(res => {
        if (res.message === 'success') {
          this.documentList.unshift(res.data);
          // Trigger view refresh
          this.documentList = this.documentList.slice();
          this.dataService.documentList.next(this.documentList);

          this.showModal = false;

        }
      });
    }
  }

  /**
   * Attempts to submit changes to a document to database
  */
  editDocument() {
    if (this.isValidInput()) {
      this.setDocumentFromForm(this.documentItem);

      this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
        if (res.message === 'success') {
          this.dataService.documentList.next(this.documentList);

          this.showModal = false;
        }
      });
    }
  }

  /**
   * Returns the id associated with docTypeName
   * @param docTypeName Name of doc type
   */
  getDocTypeID(docTypeName: String) {
    return _.find(this.docTypes, (docType) => docType.name === docTypeName).id;
  }

  /**
   * Returns the name associated with docTypeID
   * @param docTypeID ID of doc type
   */
  getDocTypeName(docTypeID: number) {
    return _.find(this.docTypes, (docType) => docType.id === docTypeID).name;
  }

  /**
     * Sets the registration date datePicker the date entered in the input field.
    */
  setRegistrationDateToDatePicker() {
    if (!this.registrationDateControl.hasError('required') && !this.registrationDateControl.hasError('dateFormat')) {
      this.registrationDateDatepickerInput = this.registrationDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets registrationDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setRegistrationDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.registrationDateInput = moment(data.value).format('YYYY-MM-DD');
    }
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
    return (
      !this.docTypeControl.hasError('required') &&
      !this.docTypeControl.hasError('docType')
    );
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
   * Returns true if entered sender is valid, else false.
  */
  isValidSender() {
    return !this.senderControl.hasError('required');
  }

  /**
   * Returns true if entered location is valid, else false.
  */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
     * Returns true if entered registration date is valid, else false.
    */
  isValidRegistrationDate() {
    return !this.registrationDateControl.hasError('required') && !this.registrationDateControl.hasError('dateFormat');
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
    return (
      this.isValidDocType() &&
      this.isValidDocNumber() &&
      this.isValidRegistrationDate() &&
      this.isValidDocDate() &&
      this.isValidDocName() &&
      this.isValidSender() &&
      this.isValidLocation()
    );
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.docTypeControl.reset();
    this.docNumberControl.reset();

    this.registrationDateControl.reset();
    this.registrationDatePickerControl = new FormControl();
    this.docDateControl.reset();
    this.docDatePickerControl = new FormControl();

    this.nameControl.reset();
    this.senderControl.reset();

    this.locationControl.reset();
    this.commentInput = null;

    this.modifyForm.resetForm();
    this.documentItem = Object.assign({}, new Document());
    this.showModal = false;
    this.showModalChange.emit(false);
  }

}
