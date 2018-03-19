import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent implements OnInit {
  @Input() documentItem: Document;
  @Output() editItem = new EventEmitter<any>();

  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  showRequestModal = false;

  showReturnModal = false;

  constructor(
    public dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService
  ) {
    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() { }

  /**
   * Change card status
   */
  setDocumentStatus(status: number) {
    this.documentItem.status = status;
    this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
      if (res.message === 'success') {
        this.showRequestModal = false;
        this.showReturnModal = false;
      }
    });
  }

  /**
   * Returns the name of the document type corresponding to the documentType
   */
  displayDocumentType() {
    if (this.documentItem.documentType > 0) {
      const documentTypeToDisplay = _.find(this.documentTypeList, documentType => documentType.id === this.documentItem.documentType);
      if (documentTypeToDisplay) {
        return documentTypeToDisplay.name;
      }
    }
    return '';
  }

  /**
   * Returns the name corresponding to the userID
   */
  displayUserName() {
    if (this.documentItem.userID) {
      return _.find(this.userList, user => user.id === this.documentItem.userID)
        .name;
    }
    return '';
  }
  route() {
    this.routeDataService.document.next(this.documentItem);
    this.router.navigate(['document-detail']);
  }

  /**
   * Set document to be outputted for editing
   */
  edit() {
    this.editItem.next(this.documentItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    if (this.documentItem.status === 1) {
      this.showRequestModal = true;
    } else {
      this.showReturnModal = true;
    }
  }
}
