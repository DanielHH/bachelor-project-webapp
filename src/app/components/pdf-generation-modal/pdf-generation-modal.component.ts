import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-pdf-generation-modal',
  templateUrl: './pdf-generation-modal.component.html',
  styleUrls: ['./pdf-generation-modal.component.scss']
})
export class PdfGenerationModalComponent implements OnInit {

  showGenerationOptions = true;
  selectedOnly = true;

  loading = false;
  hideSubmit = false;
  closeText = 'Avbryt';
  pdfView = false;
  url = '';

  filteredList: any[] = [];
  selectedList: any[] = [];

  @Input() pdfType = '';

  @Input() modalTitle = '';

  @ViewChild('modifyForm') modifyForm: NgForm;

  @Input() showModal = false;

  @Output() showModalChange = new EventEmitter<any>();

  get _showModal() {
    return this.showModal;
  }

  set _showModal(value: any) {
    if (!value) {
      this.closeModal();
    }
    this.showModal = value;
  }

  constructor(private httpService: HttpService, private modalService: ModalService) {
    this.modalService.pdfSelectedList.subscribe(selectedList =>
      this.selectedList = selectedList
    );

    this.modalService.pdfFilteredList.subscribe(filteredList => {
      if (filteredList.length) {
          this.filteredList = filteredList;
          this.showModal = true;
          if (this.pdfType !== 'inventory') {
            this.selectedOnly = false;
            this.showGenerationOptions = false;
            this.generatePDF();
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  /**
   * Toggle selectedOnly value
  */
 toggleSelectedOnly() {
  this.selectedOnly = !this.selectedOnly;
  }

generatePDF() {
  this.loading = true;
  this.hideSubmit = true;
  this.closeText = 'Stäng';

  let list = this.filteredList;
  if (this.selectedOnly) {
    list = this.selectedList;
  }
  this.httpService.httpPost<any>('genPDF', [this.pdfType, list] ).then(pdfRes => {
    if (pdfRes.message === 'success') {
      this.url = pdfRes.url;
      this.loading = false;
      this.pdfView = true;
      this.hideSubmit = true;
    }
  });
}

/**
   * Closes modal
   */
  closeModal() {
    this.showGenerationOptions = true;
    this.selectedOnly = true;

    this.loading = false;
    this.hideSubmit = false;
    this.closeText = 'Avbryt';
    this.pdfView = false;
    this.url = '';

    this.showModal = false;
  }

}
