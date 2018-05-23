import { Directive, OnDestroy } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { User } from '../datamodels/user';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appUsername]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true }]
})
export class UsernameValidatorDirective implements Validator, OnDestroy {
  users: User[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.userList.subscribe(users => {
      this.users = users;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = c.value;

    let isValid;
    let userMatch;
    if (input && input.id) {
      // User object
      userMatch = _.find(this.users, user => user.username === input.username);
      isValid = userMatch && userMatch.status.id === 5 && userMatch.userType.id === 2;
    } else {
      // String input
      userMatch = _.find(this.users, user => user.username === input);
      isValid = !input || (userMatch && userMatch.status.id === 5 && userMatch.userType.id === 2);
    }

    const message = {
      username: {
        message: 'Ogiltigt användarnamn'
      }
    };
    return isValid ? null : message;
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
