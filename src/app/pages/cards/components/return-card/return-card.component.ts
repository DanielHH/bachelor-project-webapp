import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-return-card',
  templateUrl: './return-card.component.html',
  styleUrls: ['./return-card.component.scss']
})
export class ReturnCardComponent implements OnInit {

  @Input() showModal = false;

  @Output() modalClosed = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.modalClosed.emit(false);
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

  constructor(private httpService: HttpService) {}

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
      this.cardItem.userID = null;
      this.cardItem.location = this.locationInput;
      this.cardItem.status = 1; // TODO: ENUM FOR STATUS, 1 = Returned
      this.httpService.httpPut<Card>('updateCard/', this.cardItem).then(res => {
        if (res.message === 'success') {
          this.showModal = false;
        }
      });
    }
  }

}
