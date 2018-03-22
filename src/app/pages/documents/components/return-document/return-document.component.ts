import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-return-document',
  templateUrl: './return-document.component.html',
  styleUrls: ['./return-document.component.scss']
})
export class ReturnDocumentComponent implements OnInit {

  @ViewChild('returnForm') returnForm: NgForm;

  @Input() showModal = false;

  @Output() modalClosed = new EventEmitter<boolean>();

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    this.closeForm();
  }

  documentItem: Document = null;

  /**
   * Set document that is being returned.
   */
  @Input('document') set document(document: Document) {
    if (document && document.id) {
      this.documentItem = document;
    }
  }

  locationControl = new FormControl('', Validators.required);

  locationInput = '';

  constructor(private httpService: HttpService) {}

  ngOnInit() {
  }

  /**
   * Returns true if entered location is valid, else false.
   */
  isValidLocation() {
    return !this.locationControl.hasError('required');
  }

  /**
   * Change status of a document to returned
   */
  returnDocument() {
    if (this.isValidLocation()) {
      this.documentItem.userID = null;
      this.documentItem.location = this.locationInput;
      this.documentItem.status = 1; // TODO: ENUM FOR STATUS, 1 = Returned
      this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
        if (res.message === 'success') {
          this.showModal = false;
        }
      });
    }
  }

  /**
   * Closes form. Also resets it by resetting form controls and clearing inputs
   */
  closeForm() {
    this.locationControl.reset();
    this.returnForm.resetForm();
    this.documentItem = Object.assign({}, new Document());
    this.showModal = false;
    this.modalClosed.emit(false);
  }

}
