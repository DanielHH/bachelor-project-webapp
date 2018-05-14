import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true }]
})
export class DateValidatorDirective implements Validator {
  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);

    const isValid = !input || this.isValidDateString(input);
    const message = {
      dateFormat: {
        message: 'Ogiltigt datumformat'
      }
    };
    return isValid ? null : message;
  }

  isValidDateString(str: string) {
    // Format should be YYYY-MM-DD
    const yearStr = str.substring(0, 4);
    const monthStr = str.substring(5, 7);
    const dayStr = str.substring(8, 10);
    const firstSeparator = str.substring(4, 5);
    const secondSeparator = str.substring(7, 8);

    if (str.length !== 10) {
      return false;
    }

    if (firstSeparator !== '-' || secondSeparator !== '-') {
      return false;
    }

    if (isNaN(Number(yearStr)) || isNaN(Number(monthStr)) || isNaN(Number(dayStr))) {
      return false;
    }

    const monthNum = Number(monthStr);
    const dayNum = Number(dayStr);

    if (monthNum > 12 || monthNum <= 0) {
      return false;
    }

    if (dayNum > this.getMonthDays(monthNum, Number(yearStr)) || dayNum <= 0) {
      return false;
    }

    return true;
  }

  getMonthDays(monthNum: number, yearNum: number) {
    switch (monthNum) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
      case 2:
        return this.isLeapYear(yearNum) ? 29 : 28;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return -1;
    }
  }

  isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }
}
