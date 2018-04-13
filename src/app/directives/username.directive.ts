import { Directive } from '@angular/core';
import { FormControl, Validators, Validator, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
import { User } from '../datamodels/user';
import * as _ from 'lodash';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appUsername]',
  providers: [{provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true}]
 })
 export class UsernameValidatorDirective implements Validator {

  users: User[] = [];

  constructor(public dataService: DataService) {
    // Get users from database
    this.dataService.userList.subscribe( (users) => {
      this.users = users;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = c.value;

    let isValid;
    if (input && input.id) { // User object
      isValid = _.find(this.users, (user) => user.username === input.username);
    } else { // String input
      isValid = !input || _.find(this.users, (user) => user.username === input);
    }

    const message = {
      'username': {
        'message': 'Ogiltigt användarnamn'
      }
    };
    return isValid ? null : message;
  }
 }
