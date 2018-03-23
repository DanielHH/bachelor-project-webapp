import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { routing } from './routing';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { VariableBindingComponent } from './pages/examples/code-examples/variable-binding/variable-binding.component';
import { ComponentInputComponent } from './pages/examples/code-examples/component-input/component-input.component';
import { ComponentOutputComponent } from './pages/examples/code-examples/component-output/component-output.component';
import { ComponentInoutComponent } from './pages/examples/code-examples/component-inout/component-inout.component';
import { InputTestComponent } from './pages/examples/code-examples/component-input/input-test/input-test.component';
import { OutputTestComponent } from './pages/examples/code-examples/component-output/output-test/output-test.component';
import { CardsComponent } from './pages/cards/cards.component';
import { GetComponent } from './pages/examples/code-examples/get/get.component';
import { PostComponent } from './pages/examples/code-examples/post/post.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ModifyCardComponent } from './pages/cards/components/modify-card/modify-card.component';
import { CardTableComponent } from './pages/cards/components/card-table/card-table.component';
import { CardItemComponent } from './pages/cards/components/card-item/card-item.component';
import { CardDetailComponent } from './pages/cards/components/card-detail/card-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatNativeDateModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatIconModule,
  MatToolbarModule,
  MatRadioModule,
  MatFormFieldControl,
  MatCardModule
} from '@angular/material';
import { CardTypeValidatorDirective } from './directives/card-type.directive';
import { DocumentTypeValidatorDirective } from './directives/document-type.directive';
import { UsernameValidatorDirective } from './directives/username.directive';
import { DateValidatorDirective } from './directives/date.directive';
import { DataService } from './services/data.service';
import { RouteDataService } from './services/route-data.service';
import { MatchFilterCardPipe } from './pipes/match-filter-card.pipe';
import { DocumentTableComponent } from './pages/documents/components/document-table/document-table.component';
import { MatchFilterDocumentPipe } from './pipes/match-filter-document.pipe';
import { ItemMenuComponent } from './components/item-menu/item-menu.component';
import { ModifyDocumentComponent } from './pages/documents/components/modify-document/modify-document.component';
import { UtilitiesService } from './services/utilities.service';
import { DocumentItemComponent } from './pages/documents/components/document-item/document-item.component';
import { ModalComponent } from './components/modal/modal.component';
import { DocumentDetailComponent } from './pages/documents/components/document-detail/document-detail.component';
import { RequestCardComponent } from './pages/cards/components/request-card/request-card.component';
import { ReturnCardComponent } from './pages/cards/components/return-card/return-card.component';
import { RequestDocumentComponent } from './pages/documents/components/request-document/request-document.component';
import { ReturnDocumentComponent } from './pages/documents/components/return-document/return-document.component';
import { EditService } from './services/edit.service';
import { ReceiptTableComponent } from './pages/receipts/receipts-table/receipt-table.component';
import { MatchFilterReceiptPipe } from './pipes/match-filter-receipt.pipe';
import { ReceiptItemComponent } from './pages/receipts/receipt-item/receipt-item.component';
import { RequestService } from './services/request.service';
import { ReturnService } from './services/return.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentsComponent,
    ReceiptsComponent,
    LogsComponent,
    ExamplesComponent,
    VariableBindingComponent,
    ComponentInputComponent,
    ComponentOutputComponent,
    ComponentInoutComponent,
    InputTestComponent,
    OutputTestComponent,
    CardsComponent,
    GetComponent,
    PostComponent,
    SideMenuComponent,
    ModifyCardComponent,
    CardTableComponent,
    CardItemComponent,
    UsernameValidatorDirective,
    CardTypeValidatorDirective,
    DocumentTypeValidatorDirective,
    DateValidatorDirective,
    MatchFilterCardPipe,
    CardDetailComponent,
    DocumentItemComponent,
    DocumentTableComponent,
    MatchFilterDocumentPipe,
    ItemMenuComponent,
    ModifyDocumentComponent,
    ModalComponent,
    DocumentDetailComponent,
    RequestCardComponent,
    ReturnCardComponent,
    RequestDocumentComponent,
    ReturnDocumentComponent,
    ReceiptTableComponent,
    MatchFilterReceiptPipe,
    ReceiptItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatToolbarModule,
    MatRadioModule,
    MatCardModule
  ],
  providers: [
    HttpService,
    DataService,
    RouteDataService,
    UtilitiesService,
    EditService,
    RequestService,
    ReturnService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
