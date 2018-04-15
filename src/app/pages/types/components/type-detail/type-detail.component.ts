import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseType } from '../../../../datamodels/baseType';
import { DocumentType } from '../../../../datamodels/documentType';
import { CardType } from '../../../../datamodels/cardType';

@Component({
  selector: 'app-type-detail',
  templateUrl: './type-detail.component.html',
  styleUrls: ['./type-detail.component.scss']
})
export class TypeDetailComponent implements OnInit {

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

  baseTypeItem: BaseType = null;

  isCardType: boolean;
  typeNameString: string;
  createdDateString: string;
  modifiedDateString: string;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService
  ) {
    this.modalService.detailType.subscribe((baseType: BaseType) => {
      if (baseType && baseType.type && (baseType.type as CardType).id) {
        this.baseTypeItem = baseType;
        this.isCardType = baseType.isCardType();
        this.typeNameString = baseType.getType().name;
        this.createdDateString = utilitiesService.getDateString(baseType.getType().creationDate, 'YYYY-MM-DD HH:MM:SS');
        this.modifiedDateString = utilitiesService.getDateString(baseType.getType().modifiedDate, 'YYYY-MM-DD HH:MM:SS');

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

    this.baseTypeItem = Object.assign({}, new BaseType(new CardType(), 'cardType'));
    this.modalService.detailType.next(this.baseTypeItem);

    this.showModal = false;
  }
}
