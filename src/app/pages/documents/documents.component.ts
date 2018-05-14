import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../../datamodels/document';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentList: Document[] = [];

  dataServiceSubscriber: any;

  constructor(public dataService: DataService) {
    this.dataServiceSubscriber = this.dataService.documentList.subscribe(documentList => {
      this.documentList = documentList;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.dataServiceSubscriber.unsubscribe();
  }
}
