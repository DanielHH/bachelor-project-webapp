import { Directive, Input } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';
import { Document } from '../datamodels/document';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appNewDocument]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NewDocumentValidatorDirective, multi: true }]
})
export class NewDocumentValidatorDirective implements Validator {
  @Input() document: Document = null;

  documents: Document[] = [];

  constructor(public dataService: DataService) {
    this.dataService.documentList.subscribe(documents => {
      this.documents = documents;
    });
  }

  validate(c: FormControl): ValidationErrors {
    const input = String(c.value);
    const documentMatch = _.find(this.documents, document => document.documentNumber === input);
    const isValid = !input || !documentMatch || (this.document && documentMatch.id === this.document.id);

    const message = {
      newDocument: {
        message: 'Angivet dokument-ID existerar redan'
      }
    };
    return isValid ? null : message;
  }
}
