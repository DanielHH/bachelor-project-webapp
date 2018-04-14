import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { lowerCase, UtilitiesService } from '../services/utilities.service';
import { User } from '../datamodels/user';

@Pipe({
  name: 'matchFilterUser'
})
export class MatchFilterUserPipe implements PipeTransform {

  constructor(private utilitiesService: UtilitiesService) { }

  transform(
    value: User[],
    input: string,
    showAdmins: boolean,
    showUsers: boolean,
    showActive: boolean,
    showInactive: boolean
  ): User[] {
    return _.filter(value, (user) => {
      return this.matchFilt(user, input, showAdmins, showUsers, showActive, showInactive);
    });
  }

   /**
   * Match filterInput to the various displayed fields of card
   * @param card
   * @param filterInput
   * @param showAdmins true if checkbox showAdmins checked
   * @param showUsers true if checkbox showUsers checked
   * @param showActive true if checkbox showActive checked
   * @param showInactive true if checkbox showInactive checked
   * @returns True if match found
   */
  matchFilt(
    user: User,
    filterInput: string,
    showAdmins: boolean,
    showUsers: boolean,
    showActive: boolean,
    showInactive: boolean
  ) {
    if (
      (!user) ||
      (!user.id) ||
      (this.utilitiesService.isAdmin(user) && !showAdmins) ||
      (this.utilitiesService.isUser(user) && !showUsers) ||
      (user.status.id == 5 && !showActive) ||
      (user.status.id == 6 && !showInactive)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      (_.includes(lowerCase(user.username), filterInput) === true) ||
      (_.includes(lowerCase(user.name), filterInput) === true) ||
      (_.includes(lowerCase(user.email), filterInput) === true) ||
      (_.includes(lowerCase(this.utilitiesService.getDateString(
        user.creationDate)), filterInput) === true) ||
      (_.includes(lowerCase(this.utilitiesService.getDateString(
        user.modifiedDate)), filterInput) === true)
    );
  }

}
