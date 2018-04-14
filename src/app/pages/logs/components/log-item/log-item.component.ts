import { Component, OnInit, Input } from '@angular/core';
import { LogEvent } from '../../../../datamodels/logEvent';
import { UtilitiesService } from '../../../../services/utilities.service';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss']
})
export class LogItemComponent implements OnInit {

  @Input() logItem: LogEvent;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
