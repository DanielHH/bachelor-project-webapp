import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentType } from '../../../../datamodels/documentType';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import _ = require('lodash');

@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent implements OnInit {
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
