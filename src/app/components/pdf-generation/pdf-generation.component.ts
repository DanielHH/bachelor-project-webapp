import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-pdf-generation',
  templateUrl: './pdf-generation.component.html',
  styleUrls: ['./pdf-generation.component.scss']
})
export class PdfGenerationComponent implements OnInit {

  @Input() loading = false;

  @Input() pdfView = false;

  @Input() pdfURL = '';

  pdfName = '';

  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }

  getNameFromPath() {
    if (this.pdfURL) {
      return _.last(_.split(this.pdfURL, '/'));
    }
  }

  downloadPDF() {
    if (this.pdfURL) {
      this.httpService.httpGetPDF(this.pdfURL);
    }
  }

  openPDF() {
    if (this.pdfURL) {
      window.open(this.pdfURL, '_blank');
    }
  }

}
