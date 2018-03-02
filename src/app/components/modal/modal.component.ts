import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalComponent') modal;

  @Input() modalTitle: string;

  @Output() showChange = new EventEmitter();

  modalInit = false;

  @Input('show')
  set show(value: boolean) {
    if (!this.modalInit) {
      return;
    }

    if (value) {
      this.modal.show();
    } else {
      this.modal.hide();
    }
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.modalInit = true;
  }

  setShow(value: boolean) {
    console.log('hejhej');
    this.show = value;
    this.showChange.emit(this.show);
  }
}
