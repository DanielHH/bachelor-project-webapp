import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }]
})
export class PasswordValidatorDirective implements Validator {
  constructor() {}

  validate(c: FormControl): ValidationErrors {
    const input = c.value;

    const isValid =
      !input ||
      (input.length >= 5 &&
        this.containsSpecialCharacter(input) &&
        this.containsNumber(input) &&
        !this.containsSpace(input));

    const message = {
      password: {
        message: 'Angivet lösenord för svagt'
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
