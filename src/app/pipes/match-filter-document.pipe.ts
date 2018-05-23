import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Document } from '../datamodels/document';
import { UtilitiesService, lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterDocument'
})
export class MatchFilterDocumentPipe implements PipeTransform {
  constructor(private utilitiesService: UtilitiesService) {}

  transform(
    value: Document[],
    input: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ): Document[] {
    return _.filter(value, document => {
      return this.matchFilt(document, input, showIn, showOut, showArchived, showGone);
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
    document: Document,
    filterInput: string,
    showIn: boolean,
    showOut: boolean,
    showArchived: boolean,
    showGone: boolean
  ) {
    if (
      !document ||
      !document.id ||
      (document.status.id == 1 && !showIn) ||
      (document.status.id == 2 && !showOut) ||
      (document.status.id == 3 && !showArchived) ||
      (document.status.id == 4 && !showGone)
    ) {
      return false;
    }

    filterInput = lowerCase(filterInput);

    return (
      _.includes(lowerCase(document.documentType.name), filterInput) === true ||
      _.includes(lowerCase(document.documentNumber), filterInput) === true ||
      _.includes(lowerCase(document.name), filterInput) === true ||
      _.includes(lowerCase(this.utilitiesService.getUserString(document.user)), filterInput) === true ||
      _.includes(lowerCase(document.location), filterInput) === true ||
      _.includes(lowerCase(document.comment), filterInput) === true
    );
  }
}
