import { Directive } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { DataService } from '../services/data.service';
import { CardType } from '../datamodels/cardType';
import * as _ from 'lodash';

@Directive({
  selector: '[appCardType]',
  providers: [{provide: NG_VALIDATORS, useExisting: CardTypeValidatorDirective, multi: true}]
 })
 export class CardTypeValidatorDirective implements Validator {

  cardTypes: CardType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.cardTypeList.subscribe( (cardTypes) => {
      this.cardTypes = cardTypes;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);

    const isValid = !input || _.find(this.cardTypes, (cardType) => cardType.name === input);
    const message = {
      'cardType': {
        'message': 'Ogiltig typ'
      }
    };
    return isValid ? null : message;
  }
 }
