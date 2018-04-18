import { Directive, Input } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import * as _ from 'lodash';

@Directive({
  selector: '[appPassword]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true}]
 })
 export class PasswordValidatorDirective implements Validator {

  constructor() { }

  validate(c: FormControl): ValidationErrors {
    const input = c.value;

    const isValid = (
      !input || (
        input.length >= 5 &&
        this.containsSpecialCharacter(input) &&
        this.containsNumber(input)) &&
        !this.containsSpace(input)
    );

    const message = {
      'password': {
        'message': 'Angivet lösenord för svagt'
      }
    };
    return isValid ? null : message;
  }

  containsSpace(string: string): boolean {
    return /\s/.test(string);
  }

  containsSpecialCharacter(string: string): boolean {
    return /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(string);
  }

  containsNumber(string: string): boolean {
    return /\d/.test(string);
  }

 }
