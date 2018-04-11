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

@Component({
  selector: 'app-modify-type',
  templateUrl: './modify-type.component.html',
  styleUrls: ['./modify-type.component.scss']
})
export class ModifyTypeComponent implements OnInit {

  // Form variables
  typeNameInput = '';
  typeInput = '';

  // Form Controls
  typeNameControl = new FormControl('', Validators.required);
  typeControl = new FormControl('', Validators.required);

  // Database data lists
  cardTypes = [];
  documentTypes = [];

  // Filtered lists
  filteredCardTypes: Observable<any[]> = this.cardTypeControl.valueChanges.pipe(
    startWith(''),
    map(cardType => (cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice()))
  );

  @Input() cardList: Card[];

  cardItem: Card;

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
    this.dataService.cardTypeList.subscribe(cardTypes => {
      this.cardTypes = cardTypes;
      this.cardTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.modalService.editCard.subscribe(card => {
      if (card && card.id) {
        this.cardItem = card;

        this.cardTypeInput = card.cardType.name;
        this.cardNumberInput = card.cardNumber;
        this.expirationDateInput = utilitiesService.getDateString(card.expirationDate);
        this.expirationDateDatepickerInput = this.expirationDateInput;
        this.locationInput = card.location;

        this.modalType = 1;
        this.modalTitle = 'Ändra kort';

        this._showModal = true;

        // Textarea size does not update correctly if there is no delay on assignment becuase the textarea scrollheight
        // is 0 until after 200ms~ becuase of modal?
        setTimeout(() => {
          this.commentInput = card.comment;
        }, 250);
      }
    });
  }

  ngOnInit() {}

  /**
   * Filters list of cardTypes based on cardType input
   * @param str cardType input
   */
  filterCardTypes(str: string) {
    return this.cardTypes.filter(
      cardType => str != null && cardType.name.toLowerCase().indexOf(str.toLowerCase()) === 0
    );
  }

  /**
   * Sets fields in card according to form
   * @param card Card to set form data to
   */
  setTypeFromForm(type: any) {
    if (this.isValidInput()) {
      type.name = typeNameInput;
      type.status = 1; // TODO: SET TO ACTIVE STATUS NUMBER

      card.modifiedDate = this.utilitiesService.getLocalDate();
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

      newCard.creationDate = this.utilitiesService.getLocalDate();
      newCard.status = this.utilitiesService.getStatusFromID(1);
      newCard.user = new User();

      this.httpService.httpPost<Card>('addNewCard/', newCard).then(res => {
        if (res.message === 'success') {
          this.cardList.unshift(res.data);
          // Trigger view refresh
          this.cardList = this.cardList.slice();
          this.dataService.cardList.next(this.cardList);

          this.closeForm();
        }
      });
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
   * Returns true if entered type is valid, else false.
   */
  isValidType() {
    return !this.typeControl.hasError('required') &&
    !(this.typeControl.hasError('cardType') && this.typeControl.hasError('documentType'));
  }

  /**
   * Returns true if entered type is valid, else false.
   */
  isValidTypeName() {
    return !this.typeNameControl.hasError('required');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidType() && this.isValidTypeName();
  }

  /**
   * Closes form. Also resets form by resetting form controls and clearing inputs
   */
  closeForm() {
    this.cardTypeControl.reset();
    this.cardNumberControl.reset();
    this.locationControl.reset();
    this.expirationDateControl.reset();
    this.expirationDatePickerControl.reset();
    this.commentInput = '';
    this.modifyForm.resetForm();

    this.cardItem = Object.assign({}, new Card());

    this.showModal = false;
    this.showModalChange.emit(false);
  }
}
