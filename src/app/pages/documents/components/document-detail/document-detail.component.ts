import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Document } from '../../../../datamodels/document';
import { ModalService } from '../../../../services/modal.service';
import { RouteDataService } from '../../../../services/route-data.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
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

  documentItem: Document = null;

  modalServiceSubscriber: any;

  @Input() historyRoute = true;

  constructor(
    private modalService: ModalService,
    public utilitiesService: UtilitiesService,
    private routeDataService: RouteDataService,
    private router: Router
  ) {
    this.modalServiceSubscriber = this.modalService.detailDocument.subscribe(document => {
      if (document && document.id) {
        this.documentItem = document;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.detailDocument.next(null);

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.documentItem = Object.assign({}, new Document());
    this.modalService.detailDocument.next(this.documentItem);

    this.showModal = false;
  }

  /**
   * Go to item history
   */
  routeHistory() {
    this.routeDataService.document.next(this.documentItem);
    this.router.navigate(['document-history']);
    this._showModal = false;
  }
}
