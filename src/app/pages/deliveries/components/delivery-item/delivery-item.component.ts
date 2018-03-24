import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentType } from '../../../../datamodels/documentType';
import { Document } from '../../../../datamodels/document';
import { User } from '../../../../datamodels/user';
import { DataService } from '../../../../services/data.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import * as _ from 'lodash';
import { Delivery } from '../../../../datamodels/delivery';
import * as moment from 'moment';

@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent implements OnInit {
  @Input() deliveryItem: Delivery;
  @Output() editItem = new EventEmitter<any>();

  documentTypeList: DocumentType[] = [];

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
  }

  ngOnInit() {
  }

  /**
   * Change card status
   */
  setDeliveryStatus(status: number) {
    this.deliveryItem.status = status;
    this.httpService.httpPut<Delivery>('updateDelivery/', this.deliveryItem).then(res => {
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
    if (this.deliveryItem.documentType > 0) {
      const documentTypeToDisplay = _.find(this.documentTypeList, documentType => documentType.id === this.deliveryItem.documentType);
      if (documentTypeToDisplay) {
        return documentTypeToDisplay.name;
      }
    }
    return '';
  }

  route() {
    this.routeDataService.delivery.next(this.deliveryItem);
    this.router.navigate(['delivery-detail']);
  }

    /**
   * Returns a string representation of the sentDate of the card
   */
  displayExpirationDate() {
    return moment(this.deliveryItem.sentDate).format('YYYY-MM-DD');
  }

  /**
   * Set document to be outputted for editing
   */
  edit() {
    this.editItem.next(this.deliveryItem);
  }

  /**
   * Show modal based on status
   */
  showModal() {
    if (this.deliveryItem.status === 1) {
      this.showRequestModal = true;
    } else {
      this.showReturnModal = true;
    }
  }
}
