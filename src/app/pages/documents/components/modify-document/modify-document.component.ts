import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';
import { BaseItem } from '../../../../datamodels/baseItem';
import { BaseType } from '../../../../datamodels/baseType';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-modify-document',
  templateUrl: './modify-document.component.html',
  styleUrls: ['./modify-document.component.scss']
})
export class ModifyDocumentComponent implements OnInit, OnDestroy {
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

  baseTypes: BaseType[] = []; // All card and document types

  documentList: Document[] = [];

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

  user: User;
  documentItem: Document;

  authServiceSubscriber: any;

  dataServiceSubscriber: any;

  dataServiceItemSubscriber: any;

  modalServiceSubscriber: any;

  @Output() showModalChange = new EventEmitter<any>();

  itemList: BaseItem[];

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService,
    private authService: AuthService
  ) {
    this.authServiceSubscriber = this.authService.user.subscribe(user => {
      this.user = user;
    });

    this.dataServiceSubscriber = this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
    });

    this.dataServiceSubscriber = this.dataService.typeList.subscribe(baseTypes => {
      this.baseTypes = baseTypes;

      this.docTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.dataServiceItemSubscriber = this.dataService.itemList.subscribe(itemList => (this.itemList = itemList));

    this.modalServiceSubscriber = this.modalService.editDocument.subscribe(document => {
      if (document && document.id) {
        this.documentItem = document;

        this.docTypeInput = document.documentType.name;

        this.docNumberInput = document.documentNumber;

        this.registrationDateInput = utilitiesService.getDateString(document.registrationDate);
        this.registrationDateDatepickerInput = this.registrationDateInput;
        this.docDateInput = utilitiesService.getDateString(document.documentDate);
        this.docDateDatepickerInput = this.docDateInput;

        this.nameInput = document.name;
        this.senderInput = document.sender;

        this.locationInput = document.location;

        this.modalType = 1;
        this.modalTitle = 'Ändra handling';

        this._showModal = true;

        // Textarea size does not update correctly if there is no delay on assignment becuase the textarea scrollheight
        // is 0 until after 200ms~ becuase of modal?
        setTimeout(() => {
          this.commentInput = document.comment;
        }, 250);
      } else {
        this.modalTitle = 'Lägg till ny handling';
        this.modalType = 0;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.authServiceSubscriber.unsubscribe();

    this.dataServiceSubscriber.unsubscribe();

    this.dataServiceItemSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Sets fields in document according to form
   * @param document Document to set form data to
   */
  setDocumentFromForm(document: Document) {
    if (this.isValidInput()) {
      document.documentType = this.utilitiesService.getDocumentType(0, this.docTypeInput);
      document.documentNumber = this.docNumberInput;

      document.documentDate = new Date(this.docDateInput);
      document.registrationDate = new Date(this.registrationDateInput);

      document.name = this.nameInput;
      document.sender = this.senderInput;

      document.location = this.locationInput;
      document.comment = this.commentInput ? this.commentInput : null;
      document.modifiedDate = new Date();
    }
  }

  /**
   * Attempts to submit new document to database
   */
  addNewDocument() {
    if (this.isValidInput()) {
      const newDoc = new Document();

      this.setDocumentFromForm(newDoc);

      newDoc.creationDate = new Date();
      newDoc.status = this.utilitiesService.getStatusFromID(1);
      newDoc.user = new User();

      // Create new log event 2 = Document, 3 = Create
      const logEvent = this.utilitiesService.createNewLogEventForItem(2, 3, newDoc, this.user, newDoc.documentNumber);

      this.httpService.httpPost<Document>('addNewDocument/', { document: newDoc, logEvent: logEvent }).then(res => {
        if (res.message === 'success') {
          this.documentList.unshift(res.data.document);
          this.itemList.unshift(new BaseItem(res.data.document, 'document'));

          this.documentList = this.documentList.slice();
          this.dataService.documentList.next(this.documentList);

          this.itemList = this.itemList.slice();
          this.dataService.itemList.next(this.itemList);

          this.utilitiesService.updateLogEventList(res.data.logEvent);

          this.closeForm();
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

      // Create new log event
      const logText = 'Uppgifter för ' + this.documentItem.documentNumber;

      // TODO: 2 = Document, 4 = Edit
      const logEvent = this.utilitiesService.createNewLogEventForItem(2, 4, this.documentItem, this.user, logText);

      this.httpService
        .httpPut<Document>('updateDocument/', { documentItem: this.documentItem, logEvent: logEvent })
        .then(res => {
          if (res.message === 'success') {
            this.documentList = this.documentList.slice();
            this.dataService.documentList.next(this.documentList);

            this.itemList = this.itemList.slice();
            this.dataService.itemList.next(this.itemList);

            this.dataService.getReceiptList();
            this.utilitiesService.updateLogEventList(res.data.logEvent);

            this.closeForm();
          }
        });
    }
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
      this.registrationDateInput = this.utilitiesService.getDateString(data.value);
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
      this.docDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Returns true if entered document ID is valid, else false.
   */
  isValidDocID() {
    return !this.docNumberControl.hasError('required') && !this.docNumberControl.hasError('newDocument');
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
      this.isValidDocID() &&
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
    this.registrationDatePickerControl.reset();
    this.docDateControl.reset();
    this.docDatePickerControl.reset();

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
