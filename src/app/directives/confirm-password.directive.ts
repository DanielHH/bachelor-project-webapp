import { Directive, Input } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { DataService } from '../services/data.service';
import { CardType } from '../datamodels/cardType';
import * as _ from 'lodash';

@Directive({
  selector: '[appConfirmPassword]',
  providers: [{provide: NG_VALIDATORS, useExisting: ConfirmPasswordValidatorDirective, multi: true}]
 })
 export class ConfirmPasswordValidatorDirective implements Validator {

  @Input() passwordInput = '';
  @Input() confirmPasswordInput = '';

  constructor() { }

  validate(c: FormControl): ValidationErrors {
    const isValid = (
      !this.confirmPasswordInput ||
      this.passwordInput === this.confirmPasswordInput
    );

    const message = {
      'confirmPassword': {
        'message': 'Angivna lösenord matchar inte'
      }
    };
    return isValid ? null : message;
  }
 }
