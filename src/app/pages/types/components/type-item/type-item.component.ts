import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { BaseType } from '../../../../datamodels/baseType';
import * as moment from 'moment';
import { DataService } from '../../../../services/data.service';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { User } from '../../../../datamodels/user';
import * as _ from 'lodash';
import { RouteDataService } from '../../../../services/route-data.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-type-item',
  templateUrl: './type-item.component.html',
  styleUrls: ['./type-item.component.scss']
})
export class TypeItemComponent implements OnInit {
  @Input() typeItem: BaseType;

  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];

  showRequestModal = false;
  showReturnModal = false;

  isActive: boolean;

  constructor(
    private dataService: DataService,
    private router: Router,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService) {
      this.dataService.cardTypeList.subscribe(cardTypeList => {
        this.cardTypeList = cardTypeList;
      });

      this.dataService.documentTypeList.subscribe(documentTypeList => {
        this.documentTypeList = documentTypeList;
      });
  }

  ngOnInit() { }

  /**
   * Set type to be outputted for editing
  */
  edit() {
    this.modalService.editType.next(this.typeItem);
  }

  /**
   * Sets the status of the card in the database
   */
  editStatus() {
    if (this.typeItem.isCardType()) {
      this.httpService.httpPut<CardType>('updateCardType/', this.typeItem.getType()).then(res => {
        if (res.message === 'success') {
          this.dataService.getCardTypeList();
        }
      });
    } else {
      this.httpService.httpPut<DocumentType>('updateDocumentType/', this.typeItem.getType()).then(res => {
        if (res.message === 'success') {
          this.dataService.getDocumentTypeList();
        }
      });
    }
  }
}

