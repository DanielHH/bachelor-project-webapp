import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { BaseType } from '../../../../datamodels/baseType';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-modify-type',
  templateUrl: './modify-type.component.html',
  styleUrls: ['./modify-type.component.scss']
})
export class ModifyTypeComponent implements OnInit, OnDestroy {
  typeNameInput = '';
  isCardType = true;

  typeNameControl = new FormControl('', Validators.required);
  typeControl = new FormControl('', Validators.required);

  cardTypeList = [];
  documentTypeList = [];

  baseTypeToEdit: BaseType;

  @Input() modalTitle = '';

  @Input() modalType: number;

  @ViewChild('modifyForm') modifyForm: NgForm;

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<any>();

  get _showModal() {
    return this.showModal;
  }

  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }
    this.showModal = value;
  }

  dataServiceCardSubscriber: any;

  dataServiceDocumentSubscriber: any;

  modalServiceSubscriber: any;

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
    this.dataServiceCardSubscriber = this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });

    this.dataServiceDocumentSubscriber = this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.modalServiceSubscriber = this.modalService.editType.subscribe(baseType => {
      if (baseType && baseType.getType().id) {
        this.baseTypeToEdit = baseType;

        this.typeNameInput = baseType.getType().name;
        this.isCardType = baseType.isCardType();

        this.modalType = 1;
        this.modalTitle = 'Ändra typ';

        this._showModal = true;
      } else {
        this.modalTitle = 'Lägg till ny typ';
        this.modalType = 0;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceCardSubscriber.unsubscribe();

    this.dataServiceDocumentSubscriber.unsubscribe();

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Sets fields in type according to form
   * @param type CardType or DocumentType to set form data to
   */
  setTypeFromForm(type: any) {
    if (this.isValidInput()) {
      type.name = this.typeNameInput;
      type.modifiedDate = new Date();
    }
  }

  /**
   * Toggle isCardType value
   */
  toggleIsCardType() {
    this.isCardType = !this.isCardType;
    // Updates too fast I think, works with delay
    setTimeout(() => {
      this.typeNameControl.updateValueAndValidity();
    }, 100);
  }

  /**
   * Attempts to submit new type to database
   */
  addNewType() {
    if (this.isValidInput()) {
      let newType;
      if (this.isCardType) {
        newType = new CardType();
      } else {
        newType = new DocumentType();
      }

      this.setTypeFromForm(newType);

      newType.creationDate = new Date();
      newType.status = this.utilitiesService.getStatusFromID(5); // Status = active

      if (this.isCardType) {
        this.httpService.httpPost<CardType>('addNewCardType/', newType).then(res => {
          if (res.message === 'success') {
            this.cardTypeList.unshift(res.body.data);

            this.cardTypeList = this.cardTypeList.slice();
            this.dataService.cardTypeList.next(this.cardTypeList);

            this.dataService.setTypeList();

            this.closeForm();
          }
        });
      } else {
        this.httpService.httpPost<DocumentType>('addNewDocumentType/', newType).then(res => {
          if (res.message === 'success') {
            this.documentTypeList.unshift(res.body.data);

            this.documentTypeList = this.documentTypeList.slice();
            this.dataService.documentTypeList.next(this.documentTypeList);

            this.dataService.setTypeList();

            this.closeForm();
          }
        });
      }
    }
  }

  /**
   * Attempts to submit edited cardType to database
   */
  editType() {
    if (this.isValidInput()) {
      const type = this.baseTypeToEdit.type;
      this.setTypeFromForm(type);

      if (this.isCardType) {
        this.httpService.httpPut<CardType>('updateCardType/', type).then(res => {
          if (res.message === 'success') {
            this.cardTypeList = this.cardTypeList.slice();
            this.dataService.cardTypeList.next(this.cardTypeList);

            this.dataService.setTypeList();

            this.closeForm();
            this.dataService.getReceiptList();
            this.dataService.getCardList();
          }
        });
      } else {
        this.httpService.httpPut<DocumentType>('updateDocumentType/', type).then(res => {
          if (res.message === 'success') {
            this.documentTypeList = this.documentTypeList.slice();
            this.dataService.documentTypeList.next(this.documentTypeList);

            this.dataService.setTypeList();

            this.closeForm();
            this.dataService.getReceiptList();
            this.dataService.getDocumentList();
          }
        });
      }
    }
  }

  /**
   * Returns true if entered type name is valid, else false.
   */
  isValidTypeName() {
    return !this.typeNameControl.hasError('required') && !this.typeNameControl.hasError('typeName');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidTypeName();
  }

  /**
   * Closes form. Also resets form by resetting form controls and clearing inputs
   */
  closeForm() {
    this.typeNameControl.reset();
    this.typeControl.reset();
    this.isCardType = true;
    this.modifyForm.resetForm();

    this.baseTypeToEdit = Object.assign({}, new BaseType(new CardType(), 'cardType'));

    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
