import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseType } from '../../../../datamodels/baseType';
import { CardType } from '../../../../datamodels/cardType';
import { DocumentType } from '../../../../datamodels/documentType';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-type-item',
  templateUrl: './type-item.component.html',
  styleUrls: ['./type-item.component.scss']
})
export class TypeItemComponent implements OnInit, OnDestroy {
  @Input() typeItem: BaseType;

  isActive: boolean;

  cardTypeList: CardType[] = [];
  documentTypeList: DocumentType[] = [];

  dataServiceCardSubscriber: any;

  dataServiceDocumentSubscriber: any;

  constructor(
    private dataService: DataService,
    private httpService: HttpService,
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.dataServiceCardSubscriber = this.dataService.cardTypeList.subscribe(cardTypeList => {
      this.cardTypeList = cardTypeList;
    });

    this.dataServiceDocumentSubscriber = this.dataService.documentTypeList.subscribe(documentTypeList => {
      this.documentTypeList = documentTypeList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceCardSubscriber.unsubscribe();

    this.dataServiceDocumentSubscriber.unsubscribe();
  }

  /**
   * Show the modal for type details
   */
  showDetailsModal() {
    this.modalService.detailType.next(this.typeItem);
  }

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
          this.cardTypeList = this.cardTypeList.slice();
          this.dataService.cardTypeList.next(this.cardTypeList);
        }
      });
    } else {
      this.httpService.httpPut<DocumentType>('updateDocumentType/', this.typeItem.getType()).then(res => {
        if (res.message === 'success') {
          this.documentTypeList = this.documentTypeList.slice();
          this.dataService.documentTypeList.next(this.documentTypeList);
        }
      });
    }
  }
}
