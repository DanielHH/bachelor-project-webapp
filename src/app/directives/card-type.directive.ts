import { Directive } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';

@Directive({
  selector: '[appCardType]',
  providers: [{provide: NG_VALIDATORS, useExisting: CardTypeValidatorDirective, multi: true}]
 })
 export class CardTypeValidatorDirective implements Validator {

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const cardTypes = [
      'USB',
      'MicroSD',
      'Harddrive',
      'Chip',
    ];
    const isValid = !input || cardTypes.includes(input);
    const message = {
      'cardType': {
        'message': 'Invalid card type'
      }
    };
    return isValid ? null : message;
  }
 }
