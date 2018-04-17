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
import { LogEvent } from '../../../../datamodels/logEvent';
import { BaseType } from '../../../../datamodels/baseType';

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
  commentControl = new FormControl();
  expirationDateControl = new FormControl('', Validators.required);
  expirationDatePickerControl = new FormControl();

  baseTypes: BaseType[] = []; // All card and document types

  @Input() cardList: Card[];

  cardItem: Card;

  logEvents: LogEvent[] = [];

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
    this.dataService.typeList.subscribe(baseTypes => {
      this.baseTypes = baseTypes;

      this.cardTypeControl.updateValueAndValidity({
        onlySelf: false,
        emitEvent: true
      });
    });

    // Log event list subscriber
    this.dataService.logEventList.subscribe(logEvents => {
      this.logEvents = logEvents;
    });
    this.modalService.editCard.subscribe(card => {
      this.cardItem = card;

      if (card && card.id) {
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

      } else {
        this.modalTitle = 'Lägg till nytt kort';
        this.modalType = 0;
        this.showModal = true;
      }
    });
  }

  ngOnInit() {}

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
      card.comment = this.commentInput ? this.commentInput : null;

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

      // Create new log event
      const logEvent = this.utilitiesService.createNewLogEventForItem(1, 6, newCard);

      this.httpService.httpPost<Card>('addNewCard/', {card: newCard, logEvent: logEvent}).then(res => {
        if (res.message === 'success') {
          this.cardList.unshift(res.data.card);
          // Update log event list
          this.utilitiesService.updateLogEventList(res.data.logEvent);

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
      // Create new log event
      const logText = 'Uppgifter för' + this.cardItem.cardNumber;
      const logEvent = this.utilitiesService.createNewLogEventForItem(1, 10, this.cardItem, logText);

      this.httpService.httpPut<Card>('updateCard/', {cardItem: this.cardItem, logEvent: logEvent}).then(res => {
        if (res.message === 'success') {
          this.cardList = this.cardList.slice();
          this.dataService.cardList.next(this.cardList);

          // Update log event list
          this.utilitiesService.updateLogEventList(res.data.logEvent);

          this.closeForm();
        }
      });
    }
  }

  /**
   * Sets the datePicker the date entered in the input field.
   */
  setExpirationDateToDatePicker() {
    if (!this.expirationDateControl.hasError('required') && !this.expirationDateControl.hasError('dateFormat')) {
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
    return !this.cardTypeControl.hasError('required') && !this.cardTypeControl.hasError('cardType');
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
    return !this.expirationDateControl.hasError('required') && !this.expirationDateControl.hasError('dateFormat');
  }

  /**
   * Returns true if everything in the form is valid, else false
   */
  isValidInput() {
    return this.isValidCardType() && this.isValidCardNumber() && this.isValidLocation() && this.isValidExpirationDate();
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
