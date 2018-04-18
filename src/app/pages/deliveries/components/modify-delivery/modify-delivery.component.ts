import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Delivery } from '../../../../datamodels/delivery';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { HttpService } from '../../../../services/http.service';
import { DataService } from '../../../../services/data.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';
import { BaseType } from '../../../../datamodels/baseType';

@Component({
  selector: 'app-modify-delivery',
  templateUrl: './modify-delivery.component.html',
  styleUrls: ['./modify-delivery.component.scss']
})
export class ModifyDeliveryComponent implements OnInit {
  // Form variables
  documentTypeInput = '';
  documentNumberInput = '';
  documentNameInput = '';
  receiverInput = '';

  documentDateInput = '';
  documentDateDatepickerInput = '';
  sentDateInput = '';
  sentDateDatepickerInput = '';

  commentInput = null;

  // Form Controls
  documentTypeControl = new FormControl('', Validators.required);
  documentNumberControl = new FormControl('', Validators.required);
  documentNameControl = new FormControl('', Validators.required);
  receiverControl = new FormControl('', Validators.required);
  documentDateControl = new FormControl('', Validators.required);
  documentDatePickerControl = new FormControl();
  sentDateControl = new FormControl('', Validators.required);
  sentDatePickerControl = new FormControl();

  baseTypes: BaseType[] = []; // All card and document types

  @Input() deliveryList: Delivery[];

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

  deliveryItem: Delivery;

  @Output() showModalChange = new EventEmitter<any>();

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
    this.dataService.typeList.subscribe(baseTypes => {
      this.baseTypes = baseTypes;
      this.documentTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.modalService.editDelivery.subscribe(delivery => {
      this.deliveryItem = delivery;

      if (delivery && delivery.id) {
        this.documentTypeInput = delivery.documentType.name;
        this.documentNumberInput = delivery.documentNumber;
        this.documentNameInput = delivery.name;
        this.receiverInput = delivery.receiver;

        this.documentDateInput = utilitiesService.getDateString(delivery.documentDate);
        this.documentDateDatepickerInput = this.documentDateInput;
        this.sentDateInput = utilitiesService.getDateString(delivery.sentDate);
        this.sentDateDatepickerInput = this.sentDateInput;

        this.modalType = 1;
        this.modalTitle = 'Ändra leverans';

        this._showModal = true;

        // Textarea size does not update correctly if there is no delay on assignment becuase the textarea scrollheight
        // is 0 until after 200ms~ becuase of modal?
        setTimeout(() => {
          this.commentInput = delivery.comment;
        }, 250);
      } else {
        this.modalTitle = 'Lägg till ny leverans';
        this.modalType = 0;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  /**
   * Sets fields in document according to form
   * @param document Document to set form data to
   */
  setDeliveryFromForm(delivery: Delivery) {
    if (this.isValidInput()) {
      delivery.documentType = this.utilitiesService.getDocumentType(0, this.documentTypeInput);
      delivery.documentNumber = this.documentNumberInput;
      delivery.name = this.documentNameInput;
      delivery.receiver = this.receiverInput;

      delivery.documentDate = new Date(this.documentDateInput);
      delivery.sentDate = new Date(this.sentDateInput);

      delivery.comment = this.commentInput ? this.commentInput : null;
    }
  }

  /**
   * Attempts to submit new delivery to database
   */
  addNewDelivery() {
    if (this.isValidInput()) {
      const newDelivery = new Delivery();

      this.setDeliveryFromForm(newDelivery);

      newDelivery.creationDate = this.utilitiesService.getLocalDate();
      newDelivery.modifiedDate = this.utilitiesService.getLocalDate();
      newDelivery.status = this.utilitiesService.getStatusFromID(1);

      this.httpService.httpPost<Delivery>('addNewDelivery/', newDelivery).then(res => {
        if (res.message === 'success') {
          this.deliveryList.unshift(res.data);
          // Trigger view refresh
          this.deliveryList = this.deliveryList.slice();
          this.dataService.deliveryList.next(this.deliveryList);

          this.showModal = false;
        }
      });
    }
  }

  /**
   * Attempts to submit changes to a document to database
   */
  editDelivery() {
    if (this.isValidInput()) {
      this.setDeliveryFromForm(this.deliveryItem);

      this.httpService.httpPut<Delivery>('updateDelivery/', this.deliveryItem).then(res => {
        if (res.message === 'success') {
          this.deliveryList = this.deliveryList.slice();
          this.dataService.deliveryList.next(this.deliveryList);

          this.closeForm();
        }
      });
    }
  }

  /**
   * Sets the sent date datePicker the date entered in the input field.
   */
  setDocumentDateToDatePicker() {
    if (!this.documentDateControl.hasError('required') && !this.documentDateControl.hasError('dateFormat')) {
      this.documentDateDatepickerInput = this.documentDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets documentDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setDocumentDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.documentDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Sets the sent date datePicker the date entered in the input field.
   */
  setSentDateToDatePicker() {
    if (!this.sentDateControl.hasError('required') && !this.sentDateControl.hasError('dateFormat')) {
      this.sentDateDatepickerInput = this.sentDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets sentDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setSentDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.sentDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Returns true if entered document type is valid, else false.
   */
  isValidDocumentType() {
    return !this.documentTypeControl.hasError('required') && !this.documentTypeControl.hasError('docType');
  }

  /**
   * Returns true if entered document number is valid, else false.
   */
  isValidDocumentNumber() {
    return !this.documentNumberControl.hasError('required');
  }

  /**
   * Returns true if entered document name is valid, else false.
   */
  isValidDocumentName() {
    return !this.documentNameControl.hasError('required');
  }

  /**
   * Returns true if entered receiver is valid, else false.
   */
  isValidReceiver() {
    return !this.receiverControl.hasError('required');
  }

  /**
   * Returns true if entered document date is valid, else false.
   */
  isValidDocumentDate() {
    return !this.documentDateControl.hasError('required') && !this.documentDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if entered sent date is valid, else false.
   */
  isValidSentDate() {
    return !this.sentDateControl.hasError('required') && !this.sentDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidDocumentType() &&
      this.isValidDocumentNumber() &&
      this.isValidDocumentDate() &&
      this.isValidSentDate() &&
      this.isValidDocumentName() &&
      this.isValidReceiver()
    );
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.documentTypeControl.reset();
    this.documentNumberControl.reset();
    this.documentNameControl.reset();
    this.receiverControl.reset();
    this.documentDateControl.reset();
    this.documentDatePickerControl.reset();
    this.sentDateControl.reset();
    this.sentDatePickerControl.reset();

    this.commentInput = null;

    this.modifyForm.resetForm();

    this.deliveryItem = Object.assign({}, new Delivery());

    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
