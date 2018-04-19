import { Directive, Input } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { Card } from '../datamodels/card';
import * as _ from 'lodash';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appNewCard]',
  providers: [{provide: NG_VALIDATORS, useExisting: NewCardValidatorDirective, multi: true}]
 })
 export class NewCardValidatorDirective implements Validator {

  @Input() card: Card = null;

  cards: Card[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardList.subscribe( (cards) => {
      this.cards = cards;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const cardMatch = _.find(this.cards, (card) => card.cardNumber === input);
    const isValid = !input || !cardMatch || (this.card && cardMatch.id === this.card.id);

    const message = {
      'newCard': {
        'message': 'Angivet kort-ID existerar redan'
      }
    };
    return isValid ? null : message;
  }
 }
