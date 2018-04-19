import { HttpModule } from '@angular/http';
import { HttpService } from './services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
  MatCardModule,
  MatDividerModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { CardTypeValidatorDirective } from './directives/card-type.directive';
import { NewCardValidatorDirective } from './directives/new-card.directive';
import { DocumentTypeValidatorDirective } from './directives/document-type.directive';
import { NewDocumentValidatorDirective } from './directives/new-document.directive';
import { TypeNameValidatorDirective } from './directives/type-name.directive';
import { UsernameValidatorDirective } from './directives/username.directive';
import { NewUsernameValidatorDirective } from './directives/new-username.directive';
import { DateValidatorDirective } from './directives/date.directive';
import { ConfirmPasswordValidatorDirective } from './directives/confirm-password.directive';
import { PasswordValidatorDirective } from './directives/password.directive';
import { DataService } from './services/data.service';
import { RouteDataService } from './services/route-data.service';
import { MatchFilterCardPipe } from './pipes/match-filter-card.pipe';
import { MatchFilterTypePipe } from './pipes/match-filter-type.pipe';
import { MatchFilterUserPipe } from './pipes/match-filter-user.pipe';
import { MatchFilterInventoryPipe } from './pipes/match-filter-inventory.pipe';
import { DocumentTableComponent } from './pages/documents/components/document-table/document-table.component';
import { MatchFilterDocumentPipe } from './pipes/match-filter-document.pipe';
import { ItemMenuComponent } from './components/item-menu/item-menu.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';

import { ModifyDocumentComponent } from './pages/documents/components/modify-document/modify-document.component';
import { UtilitiesService } from './services/utilities.service';
import { DocumentItemComponent } from './pages/documents/components/document-item/document-item.component';
import { DocumentDetailComponent } from './pages/documents/components/document-detail/document-detail.component';
import { ModalComponent } from './components/modal/modal.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DeliveryTableComponent } from './pages/deliveries/components/delivery-table/delivery-table.component';
import { DeliveryItemComponent } from './pages/deliveries/components/delivery-item/delivery-item.component';
import { ReceiptTableComponent } from './pages/receipts/components/receipts-table/receipt-table.component';
import { MatchFilterReceiptPipe } from './pipes/match-filter-receipt.pipe';
import { CardHistoryComponent } from './pages/cardhistory/cardhistory.component';
import { CardhistoryTableComponent } from './pages/cardhistory/components/cardhistory-table/cardhistory-table.component';
import { CardhistoryItemComponent } from './pages/cardhistory/components/cardhistory-item/cardhistory-item.component';
import { ReceiptItemComponent } from './pages/receipts/components/receipt-item/receipt-item.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InventoryTableComponent } from './pages/inventory/components/inventory-table/inventory-table.component';
import { InventoryItemComponent } from './pages/inventory/components/inventory-item/inventory-item.component';
import { MatchFilterDeliveryPipe } from './pipes/match-filter-delivery.pipe';
import { RequestCardComponent } from './pages/cards/components/request-card/request-card.component';
import { ReturnCardComponent } from './pages/cards/components/return-card/return-card.component';
import { RequestDocumentComponent } from './pages/documents/components/request-document/request-document.component';
import { ReturnDocumentComponent } from './pages/documents/components/return-document/return-document.component';
import { ModalService } from './services/modal.service';
import { ModifyDeliveryComponent } from './pages/deliveries/components/modify-delivery/modify-delivery.component';
import { PdfGenerationComponent } from './components/pdf-generation/pdf-generation.component';
import { DeliveryDetailComponent } from './pages/deliveries/components/delivery-detail/delivery-detail.component';
import { SelfVerificationComponent } from './pages/self-verification/self-verification.component';
import { UsersComponent } from './pages/users/users.component';
import { TypesComponent } from './pages/types/types.component';
import { ModifyTypeComponent } from './pages/types/components/modify-type/modify-type.component';
import { TypeTableComponent } from './pages/types/components/type-table/type-table.component';
import { TypeItemComponent } from './pages/types/components/type-item/type-item.component';
import { UserItemComponent } from './pages/users/components/user-item/user-item.component';
import { UserTableComponent } from './pages/users/components/user-table/user-table.component';
import { ModifyUserComponent } from './pages/users/components/modify-user/modify-user.component';
import { LogTableComponent } from './pages/logs/components/log-table/log-table.component';
import { LogItemComponent } from './pages/logs/components/log-item/log-item.component';
import { MatchFilterLogPipe } from './pipes/match-filter-log.pipe';
import { InventoryDetailComponent } from './pages/inventory/components/inventory-detail/inventory-detail.component';
import { UserDetailComponent } from './pages/users/components/user-detail/user-detail.component';
import { ReceiptDetailComponent } from './pages/receipts/components/receipt-detail/receipt-detail.component';
import { LogDetailComponent } from './pages/logs/components/log-detail/log-detail.component';
import { TypeDetailComponent } from './pages/types/components/type-detail/type-detail.component';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { DocumentHistoryComponent } from './pages/document-history/document-history.component';
import { DocumentHistoryItemComponent } from './pages/document-history/components/document-history-item/document-history-item.component';
import { DocumentHistoryTableComponent } from './pages/document-history/components/document-history-table/document-history-table.component';
import { PdfGenerationModalComponent } from './components/pdf-generation-modal/pdf-generation-modal.component';

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
    NewUsernameValidatorDirective,
    CardTypeValidatorDirective,
    NewCardValidatorDirective,
    DocumentTypeValidatorDirective,
    NewDocumentValidatorDirective,
    TypeNameValidatorDirective,
    DateValidatorDirective,
    ConfirmPasswordValidatorDirective,
    PasswordValidatorDirective,
    MatchFilterCardPipe,
    MatchFilterTypePipe,
    MatchFilterUserPipe,
    CardDetailComponent,
    DocumentItemComponent,
    DocumentTableComponent,
    MatchFilterDocumentPipe,
    ItemMenuComponent,
    LoginComponent,
    ModifyDocumentComponent,
    ModalComponent,
    DocumentHistoryComponent,
    DeliveriesComponent,
    DeliveryTableComponent,
    DeliveryItemComponent,
    ReceiptTableComponent,
    MatchFilterReceiptPipe,
    MatchFilterInventoryPipe,
    ReceiptItemComponent,
    CardHistoryComponent,
    CardhistoryTableComponent,
    CardhistoryItemComponent,
    InventoryComponent,
    InventoryTableComponent,
    InventoryItemComponent,
    MatchFilterDeliveryPipe,
    RequestCardComponent,
    ReturnCardComponent,
    RequestDocumentComponent,
    ReturnDocumentComponent,
    ModifyDeliveryComponent,
    PdfGenerationComponent,
    DeliveryDetailComponent,
    SelfVerificationComponent,
    UsersComponent,
    TypesComponent,
    ModifyTypeComponent,
    TypeTableComponent,
    TypeItemComponent,
    UserItemComponent,
    UserTableComponent,
    ModifyUserComponent,
    LogTableComponent,
    LogItemComponent,
    MatchFilterLogPipe,
    InventoryDetailComponent,
    UserDetailComponent,
    ReceiptDetailComponent,
    LogDetailComponent,
    TypeDetailComponent,
    DocumentHistoryItemComponent,
    DocumentHistoryTableComponent,
    DocumentDetailComponent,
    PdfGenerationModalComponent
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
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    HttpService,
    DataService,
    AuthService,
    AuthGuard,
    HttpClient,
    RouteDataService,
    UtilitiesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RouteDataService,
    UtilitiesService,
    MatchFilterCardPipe,
    MatchFilterTypePipe,
    MatchFilterDocumentPipe,
    MatchFilterDeliveryPipe,
    MatchFilterReceiptPipe,
    MatchFilterInventoryPipe,
    ModalService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'sv'}
  ],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
