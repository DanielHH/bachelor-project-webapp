import { Pipe, PipeTransform } from '@angular/core';
import { Document } from '../datamodels/document';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { User } from '../datamodels/user';
import { DocumentType } from '../datamodels/documentType';
import { lowerCase, UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterDocument'
})
export class MatchFilterDocumentPipe implements PipeTransform {

  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  constructor(
    public dataService: DataService,
    private utilitiesService: UtilitiesService
  ) {
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }


  transform(value: Document[], input: string, showIn: boolean, showOut: boolean, showArchived: boolean, showGone: boolean): Document[] {
    return _.filter(value, (document) => {
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
    filterInput = lowerCase(filterInput);

    const documentTypeString = this.utilitiesService.getDocumentTypeString(document.documentType);
    const userString = this.utilitiesService.getUserString(document.userID);

    if (
      (document.status == 1 && !showIn) ||
      (document.status == 2 && !showOut) ||
      (document.status == 3 && !showArchived) ||
      (document.status == 4 && !showGone)
    ) {
      return false;
    }

    if (
      _.includes('handling', filterInput) === false &&
      (_.includes(lowerCase(documentTypeString), filterInput) === false) &&
      (_.includes(lowerCase(document.documentNumber), filterInput) === false) &&
      (_.includes(lowerCase(document.name), filterInput) === false) &&
      (_.includes(lowerCase(userString), filterInput) === false) &&
      (_.includes(lowerCase(document.location), filterInput) === false) &&
      (_.includes(lowerCase(document.comment), filterInput) === false)
    ) {
      return false;
    }
    return true;
  }

}
