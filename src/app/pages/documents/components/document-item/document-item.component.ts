import { Component, OnInit, Input, Output } from '@angular/core';
import { Document } from '../../../../datamodels/document';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { EditService } from '../../../../services/edit.service';
import { RequestService } from '../../../../services/request.service';
import { ReturnService } from '../../../../services/return.service';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent implements OnInit {
  @Input() documentItem: Document;

  documentTypeList: DocumentType[] = [];
  userList: User[] = [];

  constructor(
    public dataService: DataService,
    private routeDataService: RouteDataService,
    private router: Router,
    private httpService: HttpService,
    private editService: EditService,
    private requestService: RequestService,
    private returnService: ReturnService) {

    this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });

    this.dataService.userList.subscribe(userList => {
      this.userList = userList;
    });
  }

  ngOnInit() { }

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
    this.editService.document.next(this.documentItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    const returnedStatus = 1;
    if (this.documentItem.status == returnedStatus) { // Don't change to ===, doesn't work
      this.requestService.document.next(this.documentItem);
    } else {
      this.returnService.document.next(this.documentItem);
    }
  }

  /**
   * Sets the status of the document in the database
   */
  editStatus() {
    this.httpService.httpPut<Document>('updateDocument/', this.documentItem).then(res => {
      if (res.message === 'success') { }
    });
  }
}
