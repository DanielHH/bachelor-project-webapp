import { Directive, Input } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { DataService } from '../services/data.service';
import { CardType } from '../datamodels/cardType';
import * as _ from 'lodash';

@Directive({
  selector: '[appCardType]',
  providers: [{provide: NG_VALIDATORS, useExisting: CardTypeValidatorDirective, multi: true}]
 })
 export class CardTypeValidatorDirective implements Validator {

  @Input() cardType = null;

  cardTypes: CardType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe( (cardTypes) => {
      this.cardTypes = cardTypes;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = c.value;
    let cardTypeMatch;

    let isValid;
    if (!input) {
      isValid = true;
    } else {
      if (input.id) { // CardType object
        cardTypeMatch = _.find(this.cardTypes, (cardType) => cardType.name === input.name);
      } else { // String input
        cardTypeMatch = _.find(this.cardTypes, (cardType) => cardType.name === input);
      }

      isValid = (
        (cardTypeMatch && cardTypeMatch.status.id === 5) ||
        (cardTypeMatch && this.cardType && cardTypeMatch.id == this.cardType.id)
      );

    }

    const message = {
      'cardType': {
        'message': 'Ogiltig typ'
      }
    };
    return isValid ? null : message;
  }
 }
