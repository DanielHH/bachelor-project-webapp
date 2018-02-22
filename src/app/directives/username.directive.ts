import { Directive } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';

@Directive({
  selector: '[appUsername]',
  providers: [{provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true}]
 })
 export class UsernameValidatorDirective implements Validator {

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const usernames = [
      'jenli414',
      'nikni459',
      'phibe092',
      'johli252',
      'davha914',
      'danhe178',
      'andlu984'
    ];
    const isValid = !input || usernames.includes(input);
    const message = {
      'username': {
        'message': 'Invalid username'
      }
    };
    return isValid ? null : message;
  }
 }
