import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseType } from '../../../../datamodels/baseType';
import { CardType } from '../../../../datamodels/cardType';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-type-detail',
  templateUrl: './type-detail.component.html',
  styleUrls: ['./type-detail.component.scss']
})
export class TypeDetailComponent implements OnInit, OnDestroy {
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
  statusString: string;

  modalServiceSubscriber: any;

  constructor(private modalService: ModalService, public utilitiesService: UtilitiesService) {
    this.modalServiceSubscriber = this.modalService.detailType.subscribe((baseType: BaseType) => {
      if (baseType && baseType.type && (baseType.type as CardType).id) {
        this.baseTypeItem = baseType;
        this.isCardType = baseType.isCardType();
        this.typeNameString = baseType.getType().name;
        this.createdDateString = utilitiesService.getDateString(baseType.getType().creationDate, 'YYYY-MM-DD HH:mm:ss');
        this.modifiedDateString = utilitiesService.getDateString(
          baseType.getType().modifiedDate,
          'YYYY-MM-DD HH:mm:ss'
        );
        this.statusString = baseType.getType().status.name;

        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalServiceSubscriber.unsubscribe();
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
