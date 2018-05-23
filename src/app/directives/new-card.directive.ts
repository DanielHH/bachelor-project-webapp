import { Directive, Input, OnDestroy } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { Card } from '../datamodels/card';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appNewCard]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NewCardValidatorDirective, multi: true }]
})
export class NewCardValidatorDirective implements Validator, OnDestroy {
  @Input() card: Card = null;

  cards: Card[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.cardList.subscribe(cards => {
      this.cards = cards;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const cardMatch = _.find(this.cards, card => card.cardNumber === input);
    const isValid = !input || !cardMatch || (this.card && cardMatch.id === this.card.id);

    const message = {
      newCard: {
        message: 'Angivet kort-ID existerar redan'
      }
    };
    return isValid ? null : message;
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
