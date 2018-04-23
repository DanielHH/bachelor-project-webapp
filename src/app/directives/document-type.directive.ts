import { Directive, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { DocumentType } from '../datamodels/documentType';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appDocumentType]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DocumentTypeValidatorDirective, multi: true }]
})
export class DocumentTypeValidatorDirective implements Validator {
  @Input() docType = null;

  docTypes: DocumentType[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentTypeList.subscribe(docTypes => {
      this.docTypes = docTypes;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = c.value;
    let docTypeMatch;

    let isValid;
    if (!input) {
      isValid = true;
    } else {
      if (input.id) {
        // DocumentType object
        docTypeMatch = _.find(this.docTypes, docType => docType.name === input.name);
      } else {
        // String input
        docTypeMatch = _.find(this.docTypes, docType => docType.name === input);
      }

      isValid =
        (docTypeMatch && docTypeMatch.status.id === 5) ||
        (docTypeMatch && this.docType && docTypeMatch.id == this.docType.id);
    }

    const message = {
      docType: {
        message: 'Ogiltig typ'
      }
    };
    return isValid ? null : message;
  }
}
