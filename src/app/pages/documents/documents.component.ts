import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../../datamodels/document';

import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { ModifyDocumentComponent } from './components/modify-document/modify-document.component';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documentList: Document[] = [];

  showAddNewModal = false;

  showEditModal = false;

  @ViewChild(ModifyDocumentComponent) modifyDocumentComponent: ModifyDocumentComponent;

  @ViewChild('addNewDocumentForm') addNewDocumentForm: NgForm;

  @ViewChild('editDocumentForm') editDocumentForm: NgForm;

  constructor(public dataService: DataService) {
    this.dataService.documentList.subscribe( (documentList) => {
      this.documentList = documentList;
    });

  }

  ngOnInit() {
  }

  submitNewDocument() {
    this.modifyDocumentComponent.addNewDocument().then(() => {
      this.showAddNewModal = false;
      this.addNewDocumentForm.resetForm();
    });
  }

  submitEditDocument() {
    this.modifyDocumentComponent.editDocument().then(() => {
      this.showEditModal = false;
      this.editDocumentForm.resetForm();
    });
  }

}
