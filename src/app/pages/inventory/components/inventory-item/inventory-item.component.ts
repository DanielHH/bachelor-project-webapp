import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseItem } from '../../../../datamodels/baseItem';
import { Card } from '../../../../datamodels/card';
import { Document } from '../../../../datamodels/document';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input() baseItem: BaseItem;

  @Output() checkedChanged = new EventEmitter<any>();

  constructor(
    private httpService: HttpService,
    private utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) {
  }

  ngOnInit() {}

  /**
   * Shows the modal for inventory details
   */
  showDetailsModal() {
    this.modalService.detailInventory.next(this.baseItem);
  }

  /**
   * Sets the status of the document in the database
   */
  editStatus() {
    if (this.baseItem.isCard()) {
      this.httpService.httpPut<Card>('updateCard/', {cardItem: this.baseItem.getItem()}).then(res => {
        if (res.message === 'success') {
        }
      });
    } else {
      this.httpService.httpPut<Document>('updateDocument/', {documentItem: this.baseItem.getItem()}).then(res => {
        if (res.message === 'success') {
        }
      });
    }
  }

  getUser() {
    return this.utilitiesService.getUserString(this.baseItem.getUser());
  }

  toggleSelected() {
    this.baseItem.isChecked = !this.baseItem.isChecked;
    this.checkedChanged.emit(true);
  }
}
