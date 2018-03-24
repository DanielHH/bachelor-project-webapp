import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../../../../datamodels/user';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-return-card',
  templateUrl: './return-card.component.html',
  styleUrls: ['./return-card.component.scss']
})
export class ReturnCardComponent implements OnInit {

  @ViewChild('returnForm') returnForm: NgForm;

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.closeForm();
  }

  cardItem: Card = null;

  /**
   * Set card that is being returned.
   */
  @Input('card') set card(card: Card) {
    if (card && card.id) {
      this.cardItem = card;
    }
  }

  locationControl = new FormControl('', Validators.required);

  locationInput = '';

  constructor(private httpService: HttpService, private utilitiesService: UtilitiesService) {}

  ngOnInit() {
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Change status of a card to returned
   */
  returnCard() {
    if (this.isValidLocation()) {
      this.cardItem.user = new User();
      this.cardItem.location = this.locationInput;
      this.cardItem.status = this.utilitiesService.getStatusFromID(1); // TODO: ENUM FOR STATUS, 1 = Returned
      this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
        if (res.message === 'success') {
          this.showModal = false;
        }
      });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.returnForm.resetForm();
    this.cardItem = Object.assign({}, new Card());
    this.showModal = false;
    this.showModalChange.emit(false);
  }

}
