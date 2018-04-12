import {
  Component,
  OnInit,
  Input,
  Directive,
  Inject,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  NgZone
} from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import * as _ from 'lodash';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';
import { User } from '../../../../datamodels/user';
import { CardType } from '../../../../datamodels/cardType';
import { BaseType } from '../../../../datamodels/baseType';

@Component({
  selector: 'app-modify-type',
  templateUrl: './modify-type.component.html',
  styleUrls: ['./modify-type.component.scss']
})
export class ModifyTypeComponent implements OnInit {

  // Form variables
  typeNameInput = '';
  isCardType = true;

  // Form Controls
  typeNameControl = new FormControl('', Validators.required);
  typeControl = new FormControl('', Validators.required);

  // Database data lists
  cardTypeList = [];
  documentTypeList = [];

  typeItem: BaseType;

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

  constructor(
    private httpService: HttpService,
    private dataService: DataService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
    this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });

    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.modalService.editType.subscribe(type => {
      if (type && type.getType().id) {
        this.typeItem = type;

        this.typeNameInput = type.getType().name;
        this.isCardType = type.isCardType();

        this.modalType = 1;
        this.modalTitle = 'Ändra typ';

        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  /**
   * Sets fields in card according to form
   * @param card Card to set form data to
   */
  setTypeFromForm(type: any) {
    if (this.isValidInput()) {
      type.name = this.typeNameInput;
      type.modifiedDate = this.utilitiesService.getLocalDate();
    }
  }

  /**
   * Attempts to submit new card to database
   */
  addNewtype() {
    if (this.isValidInput()) {
      let newType;
      if (this.typeItem.isCardType()) {
        newType = new CardType();
      } else {
        newType = new DocumentType();
      }

      this.setTypeFromForm(newType);

      newType.creationDate = this.utilitiesService.getLocalDate();
      newType.status = this.utilitiesService.getStatusFromID(1); // Status = active

      if (this.typeItem.isCardType()) {
        this.httpService.httpPost<CardType>('addNewCardType/', newType).then(res => {
          if (res.message === 'success') {
            this.cardTypeList.unshift(res.data);
            // Trigger view refresh
            this.cardTypeList = this.cardTypeList.slice();
            this.dataService.cardList.next(this.cardTypeList);

            this.closeForm();
          }
        });
      } else {
        this.httpService.httpPost<DocumentType>('addNewDocumentType/', newType).then(res => {
          if (res.message === 'success') {
            this.documentTypeList.unshift(res.data);
            // Trigger view refresh
            this.documentTypeList = this.documentTypeList.slice();
            this.dataService.documentList.next(this.documentTypeList);

            this.closeForm();
          }
        });
      }
    }
  }

  /**
   * Attempts to submit edited card to database
   */
  editType() {
    if (this.isValidInput()) {
      this.setTypeFromForm(this.typeItem);

      if (this.typeItem.isCardType()) {
        this.httpService.httpPut<CardType>('updateCardType/', this.typeItem).then(res => {
          if (res.message === 'success') {
            this.cardTypeList = this.cardTypeList.slice();
            this.dataService.cardTypeList.next(this.cardTypeList);

            this.closeForm();
          }
        });
      } else {
        this.httpService.httpPut<DocumentType>('updateDocumenType/', this.typeItem).then(res => {
          if (res.message === 'success') {
            this.documentTypeList = this.documentTypeList.slice();
            this.dataService.documentTypeList.next(this.documentTypeList);

            this.closeForm();
          }
        });
      }
    }
  }

  /**
   * Returns true if entered type name is valid, else false.
   */
  isValidTypeName() {
    return !this.typeNameControl.hasError('required');
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
    this.modifyForm.resetForm();

    this.typeItem = Object.assign({}, new BaseType(this.utilitiesService, new CardType(), 'cardType'));

    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
