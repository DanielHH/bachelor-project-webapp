import { Document } from '../../../../datamodels/document';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentHistoryComponent implements OnInit {

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

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailDocument.subscribe((document) => {
      if (document && document.id) {
        this.documentItem = document;
        this._showModal = true;
      }
    });

  }
  ngOnInit() {
  }

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
