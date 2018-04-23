import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../../../../datamodels/document';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {
  @ViewChild('detailForm') detailForm: NgForm;

  showModal = false;

  get _showModal() {
    return this.showModal;
  }
  set _showModal(value: any) {
    if (!value) {
      this.closeForm();
    }

    this.showModal = value;
  }

  documentItem: Document = null;

  constructor(private modalService: ModalService, public utilitiesService: UtilitiesService) {
    this.modalService.detailDocument.subscribe(document => {
      if (document && document.id) {
        this.documentItem = document;
        this._showModal = true;
      }
    });
  }
  ngOnInit() {}

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.documentItem = Object.assign({}, new Document());
    this.modalService.detailDocument.next(this.documentItem);

    this.showModal = false;
  }
}
