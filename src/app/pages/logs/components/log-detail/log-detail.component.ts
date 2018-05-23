import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LogEvent } from '../../../../datamodels/logEvent';
import { ModalService } from '../../../../services/modal.service';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss']
})
export class LogDetailComponent implements OnInit, OnDestroy {
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

  logEventItem: LogEvent = null;

  modalServiceSubscriber: any;

  constructor(private modalService: ModalService, public utilitiesService: UtilitiesService) {
    this.modalServiceSubscriber = this.modalService.detailLogEvent.subscribe(logEvent => {
      if (logEvent && logEvent.id) {
        this.logEventItem = logEvent;
        this._showModal = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.modalService.detailLogEvent.next(null);

    this.modalServiceSubscriber.unsubscribe();
  }

  /**
   * Closes form.
   */
  closeForm() {
    this.detailForm.resetForm();

    this.logEventItem = Object.assign({}, new LogEvent());
    this.modalService.detailLogEvent.next(this.logEventItem);

    this.showModal = false;
  }
}
