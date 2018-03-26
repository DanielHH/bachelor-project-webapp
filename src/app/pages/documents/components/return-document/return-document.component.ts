import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import { HttpService } from '../../../../services/http.service';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { User } from '../../../../datamodels/user';
import { UtilitiesService } from '../../../../services/utilities.service';

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

  @Input() documentItem: Document = null;

  locationControl = new FormControl('', Validators.required);

  locationInput = '';

  constructor(private httpService: HttpService, private utilitiesService: UtilitiesService) { }

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
      this.documentItem.user = new User();
      this.documentItem.location = this.locationInput;
      this.documentItem.status = this.utilitiesService.getStatusFromID(1);  // TODO: ENUM FOR STATUS, 1 = Returned
      this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
        if (res.message === 'success') {          
          this.closeForm();
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
    this.showModal = false;
    this.modalClosed.emit(false);
  }

}
