import { Component, OnInit, Input, Directive, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-modify-card',
  templateUrl: './modify-card.component.html',
  styleUrls: ['./modify-card.component.scss']
})
export class ModifyCardComponent implements OnInit {

  // Form variables
  cardTypeInput = '';
  cardNumberInput = '';
  locationInput = '';
  expirationDateInput = '';
  expirationDateDatepickerInput = '';
  commentInput = '';

  // Form Controls
  cardTypeControl = new FormControl('', Validators.required);
  cardNumberControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  expirationDateControl = new FormControl('', Validators.required);
  expirationDatePickerControl = new FormControl();

  // Database data lists
  cardTypes = [];

  // Filtered lists
  filteredCardTypes: Observable<any[]> = this.cardTypeControl.valueChanges.pipe(
    startWith(''),
    map(
      cardType =>
        cardType ? this.filterCardTypes(cardType) : this.cardTypes.slice()
    )
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
    private modalService: ModalService,
  ) {

    this.dataService.cardTypeList.subscribe(cardTypes => {
      this.cardTypes = cardTypes;
      this.cardTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    this.modalService.editCard.subscribe((card) => {
      if (card && card.id) {
        this.cardItem = card;

        this.cardTypeInput = card.cardType.name;
        this.cardNumberInput = card.cardNumber;
        this.expirationDateInput = utilitiesService.getDateString(card.expirationDate);
        this.expirationDateDatepickerInput = this.expirationDateInput;
        this.locationInput = card.location;
        this.commentInput = card.comment;

        this.modalType = 1;
        this.modalTitle = 'Ändra kort';

        this._showModal = true;
      }
    });

  }

  ngOnInit() { }

  /**
   * Filters list of cardTypes based on cardType input
   * @param str cardType input
   */
  filterCardTypes(str: string) {
    return this.cardTypes.filter(
      cardType =>
        str != null &&
        cardType.name.toLowerCase().indexOf(str.toLowerCase()) === 0
    );
  }

  /**
   * Sets fields in card according to form
   * @param card Card to set form data to
   */
  setCardFromForm(card: Card) {
    if (this.isValidInput()) {
      card.cardType = this.utilitiesService.getCardType(0, this.cardTypeInput);
      card.cardNumber = this.cardNumberInput;
      card.location = this.locationInput;
      card.expirationDate = new Date(this.expirationDateInput);
      card.comment = this.commentInput;

      card.modifiedDate = this.utilitiesService.getLocalDate();
    }
  }

  /**
   * Attempts to submit new card to database
   */
  addNewCard() {
    if (this.isValidInput()) {
      const newCard = new Card();

      this.setCardFromForm(newCard);

      newCard.creationDate = this.utilitiesService.getLocalDate();
      newCard.status = this.utilitiesService.getStatusFromID(1);
      newCard.user = new User();

      this.httpService.httpPost<Card>('addNewCard/', newCard).then(res => {
        if (res['message'] === 'success') {
          this.cardList.unshift(res['data']);
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
  editCard() {

    if (this.isValidInput()) {
      this.setCardFromForm(this.cardItem);

      this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
        if (res['message'] === 'success') {
          this.cardList = this.cardList.slice();
          this.dataService.cardList.next(this.cardList);

          this.closeForm();
        }
      });
    }
  }

  /**
   * Sets the datePicker the date entered in the input field.
   */
  setExpirationDateToDatePicker() {
    if (
      !this.expirationDateControl.hasError('required') &&
      !this.expirationDateControl.hasError('dateFormat')
    ) {
      this.expirationDateDatepickerInput = this.expirationDateInput; // Set date in Datepicker
    }
  }

  /**
   * Sets expirationDate from datePicker to visible input field in YYYY-MM-DD format
   * @param data Date selected in datePicker
   */
  setExpirationDateFromDatepicker(data: any) {
    if (data.value != null) {
      this.expirationDateInput = this.utilitiesService.getDateString(data.value);
    }
  }

  /**
   * Returns true if entered card type is valid, else false.
   */
  isValidCardType() {
    return (
      !this.cardTypeControl.hasError('required') &&
      !this.cardTypeControl.hasError('cardType')
    );
  }

  /**
   * Returns true if entered card number is valid, else false.
   */
  isValidCardNumber() {
    return !this.cardNumberControl.hasError('required');
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Returns true if entered expiration date is valid, else false.
   */
  isValidExpirationDate() {
    return !this.expirationDateControl.hasError('required') &&
      !this.expirationDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return (
      this.isValidCardType() &&
      this.isValidCardNumber() &&
      this.isValidLocation() &&
      this.isValidExpirationDate()
    );
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
