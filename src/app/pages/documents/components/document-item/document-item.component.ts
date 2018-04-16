import { Component, OnInit, Input, Output } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent implements OnInit {
  @Input() documentItem: Document;

  documentList: Document[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  constructor(
    public dataService: DataService,
    private router: Router,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService) {

    this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
    });

    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() { }

  /**
   * Shows the modal for document details
   */
  showDetailsModal() {
    this.modalService.detailDocument.next(this.documentItem);
  }

  /**
   * Show modal based on status
   * 1 = returned, 2 = available
   */
  showModal() {
    if (this.documentItem.status.id == 1) {
      this.modalService.requestDocument.next(this.documentItem);
    } else {
      this.modalService.returnDocument.next(this.documentItem);
    }
  }

  /**
   * Set document to be outputted for editing
   */
  edit() {
    this.modalService.editDocument.next(this.documentItem);
  }

  /**
   * Sets the status of the document in the database
   */
  editStatus() {
    this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
      if (res.message === 'success') {
        this.dataService.documentList.next(this.documentList);
      }
    });
  }
}
