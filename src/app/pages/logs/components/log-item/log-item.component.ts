import { Component, OnInit, Input } from '@angular/core';
import { LogEvent } from '../../../../datamodels/logEvent';
import { UtilitiesService } from '../../../../services/utilities.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss']
})
export class LogItemComponent implements OnInit {

  @Input() logEventItem: LogEvent;

  constructor(
    public utilitiesService: UtilitiesService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  /**
   * Show the modal for user details
   */
  showDetailsModal() {
    this.modalService.detailLogEvent.next(this.logEventItem);
  }

}
