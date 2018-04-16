import { Pipe, PipeTransform } from '@angular/core';
import { LogEvent } from '../datamodels/logEvent';
import { lowerCase, UtilitiesService } from '../services/utilities.service';
import * as _ from 'lodash';

@Pipe({
  name: 'matchFilterLog'
})
export class MatchFilterLogPipe implements PipeTransform {

  constructor(private utilitiesService: UtilitiesService) { }

  transform(value: LogEvent[], input: string, showReceipt: boolean, showRest: boolean): LogEvent[] {
    return _.filter(value, (logEvent) => {
      return this.matchFilt(logEvent, input, showReceipt, showRest);
    });
  }

   /**
   * Match filterInput to the various displayed fields of card
   * @param card
   * @param filterInput
   * @param showIn true if checkbox showIn checked
   * @param showOut true if checkbox showOut checked
   * @param showArchived true if checkbox showArchived checked
   * @param showGone true if checkbox showGone checked
   * @returns True if match found
   */
  matchFilt(
    logEvent: LogEvent,
    filterInput: string,
    showReceipt: boolean,
    showRest: boolean,
  ) {

    if (
      (!logEvent) ||
      (!logEvent.id) ||
      ((logEvent.logType.name == 'Inkvittering' || logEvent.logType.name == 'Utkvittering') && !showReceipt) ||
      ((logEvent.logType.name != 'Inkvittering' && logEvent.logType.name != 'Utkvittering' && !showRest))
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      (_.includes(lowerCase(logEvent.logDate), filterInput) === true) ||
      (_.includes(lowerCase(logEvent.logType.name), filterInput) === true) ||
      (_.includes(lowerCase(logEvent.logText), filterInput) === true) ||
      (_.includes(lowerCase(this.utilitiesService.getUserString(logEvent.user)), filterInput) === true)
    );
  }

}
