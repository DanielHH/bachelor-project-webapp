import { Directive, Input, OnDestroy } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { User } from '../datamodels/user';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appNewUsername]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NewUsernameValidatorDirective, multi: true }]
})
export class NewUsernameValidatorDirective implements Validator, OnDestroy {
  @Input() user: User = null;

  users: User[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.userList.subscribe(users => {
      this.users = users;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const userMatch = _.find(this.users, user => user.username === input);
    const isValid = !input || !userMatch || (userMatch && this.user && userMatch.id == this.user.id);

    const message = {
      newUsername: {
        message: 'Angivet användarnamn existerar redan'
      }
    };
    return isValid ? null : message;
  }

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
