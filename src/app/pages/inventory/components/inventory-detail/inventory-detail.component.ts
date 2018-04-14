import { Document } from '../../../../datamodels/document';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseItem } from '../../../../datamodels/baseItem';
import { Card } from '../../../../datamodels/card';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {
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

    baseItem: BaseItem = null;

    constructor(
      private modalService: ModalService,
      public utilitiesService: UtilitiesService
    ) {
      this.modalService.detailInventory.subscribe((baseItem) => {
        console.log('In detail ts');
        if (baseItem && baseItem.item.id) {
          console.log('hej');
          this.baseItem = baseItem;
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

      this.baseItem = Object.assign({}, new BaseItem(null, new Card(), 'card'));
      this.modalService.detailInventory.next(this.baseItem);

      this.showModal = false;
    }
  }
