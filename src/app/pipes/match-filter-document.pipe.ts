import { Pipe, PipeTransform } from '@angular/core';
import { Document } from '../datamodels/document';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { User } from '../datamodels/user';
import { DocumentType } from '../datamodels/documentType';
import { lowerCase } from '../services/utilities.service';

@Pipe({
  name: 'matchFilterDocument'
})
export class MatchFilterDocumentPipe implements PipeTransform {

  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }


  transform(value: Document[], input: string): Document[] {
    if (input !== '') {
      return _.filter(value, (document) => {
        return this.matchFilt(document, input);
      });
    }
    return value;
  }

  matchFilt(document: Document, filterInput: string) {
    filterInput = lowerCase(filterInput);

    if (_.includes(lowerCase(this.getDocumentType(document)), filterInput) === false
    && (_.includes(lowerCase(document.documentNumber), filterInput) === false)
    && (_.includes(lowerCase(document.name), filterInput) === false)
    && (_.includes(lowerCase(this.getUserName(document)), filterInput) === false)
    && (_.includes(lowerCase(document.location), filterInput) === false)
    && (_.includes(lowerCase(document.comment), filterInput) === false) ) {
      return false;
    }
    return true;
  }

  getDocumentType(document: Document) {
    if (document.documentType > 0) {
      const documentTypeToDisplay = _.find( this.documentTypeList, documentType => documentType.id === document.documentType);
      if (documentTypeToDisplay) {
        return documentTypeToDisplay.name;
      }
    }
    return '';
  }

  getUserName(document: Document) {
    if (document.userID > 0) {
      const userToDisplay = _.find( this.userList, user => user.id === document.userID);
      if (userToDisplay) {
        return userToDisplay.name;
      }
    }
    return '';
  }

}
