import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { Document } from '../../../../datamodels/document';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
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

  user: User;
  documentList: Document[] = [];
  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  constructor(
    public dataService: DataService,
    private router: Router,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private authService: AuthService
  ) {
    this.authService.user.subscribe(user => {
      this.user = user;
    });

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

  ngOnInit() {}

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
    // Create new log event
    const logText = this.documentItem.documentNumber + ' till ' + this.documentItem.status.name;
    const logEvent = this.utilitiesService.createNewLogEventForItem(2, 12, this.documentItem, this.user, logText);

    this.httpService
      .httpPut<Document>('updateDocument/', { documentItem: this.documentItem, logEvent: logEvent })
      .then(res => {
        if (res.message === 'success') {
          this.dataService.documentList.next(this.documentList);

          this.utilitiesService.updateLogEventList(res.data.logEvent);
        }
      });
  }
}
