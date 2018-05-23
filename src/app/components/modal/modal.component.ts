import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalComponent') modal;

  @Input() modalTitle: string;

  @Input() submitName = 'Spara';

  @Input() closeName = 'Avbryt';

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

  @Input() hideSubmit = false;
  @Input() hideClose = false;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.modalInit = true;
  }

  /**
   * Set modal to show
   * @param value boolean to show or hide modal
   */
  setShow(value: boolean) {
    this.show = value;
    this.showChange.emit(this.show);
  }
}
