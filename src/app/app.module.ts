import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { AppComponent } from './components/app/app.component';
import { ItemMenuComponent } from './components/item-menu/item-menu.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { PdfGenerationModalComponent } from './components/pdf-generation-modal/pdf-generation-modal.component';
import { PdfGenerationComponent } from './components/pdf-generation/pdf-generation.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CardTypeValidatorDirective } from './directives/card-type.directive';
import { ConfirmPasswordValidatorDirective } from './directives/confirm-password.directive';
import { DateValidatorDirective } from './directives/date.directive';
import { DocumentTypeValidatorDirective } from './directives/document-type.directive';
import { NewCardValidatorDirective } from './directives/new-card.directive';
import { NewDocumentValidatorDirective } from './directives/new-document.directive';
import { NewUsernameValidatorDirective } from './directives/new-username.directive';
import { PasswordValidatorDirective } from './directives/password.directive';
import { TypeNameValidatorDirective } from './directives/type-name.directive';
import { UsernameValidatorDirective } from './directives/username.directive';
import { CardHistoryComponent } from './pages/card-history/card-history.component';
import { CardHistoryItemComponent } from './pages/card-history/components/card-history-item/card-history-item.component';
import { CardHistoryTableComponent } from './pages/card-history/components/card-history-table/card-history-table.component';
import { CardsComponent } from './pages/cards/cards.component';
import { CardDetailComponent } from './pages/cards/components/card-detail/card-detail.component';
import { CardItemComponent } from './pages/cards/components/card-item/card-item.component';
import { CardTableComponent } from './pages/cards/components/card-table/card-table.component';
import { ModifyCardComponent } from './pages/cards/components/modify-card/modify-card.component';
import { RequestCardComponent } from './pages/cards/components/request-card/request-card.component';
import { ReturnCardComponent } from './pages/cards/components/return-card/return-card.component';
import { DeliveryDetailComponent } from './pages/deliveries/components/delivery-detail/delivery-detail.component';
import { DeliveryItemComponent } from './pages/deliveries/components/delivery-item/delivery-item.component';
import { DeliveryTableComponent } from './pages/deliveries/components/delivery-table/delivery-table.component';
import { ModifyDeliveryComponent } from './pages/deliveries/components/modify-delivery/modify-delivery.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DocumentHistoryItemComponent } from './pages/document-history/components/document-history-item/document-history-item.component';
import { DocumentHistoryTableComponent } from './pages/document-history/components/document-history-table/document-history-table.component';
import { DocumentHistoryComponent } from './pages/document-history/document-history.component';
import { DocumentDetailComponent } from './pages/documents/components/document-detail/document-detail.component';
import { DocumentItemComponent } from './pages/documents/components/document-item/document-item.component';
import { DocumentTableComponent } from './pages/documents/components/document-table/document-table.component';
import { ModifyDocumentComponent } from './pages/documents/components/modify-document/modify-document.component';
import { RequestDocumentComponent } from './pages/documents/components/request-document/request-document.component';
import { ReturnDocumentComponent } from './pages/documents/components/return-document/return-document.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home/home.component';
import { InventoryDetailComponent } from './pages/inventory/components/inventory-detail/inventory-detail.component';
import { InventoryItemComponent } from './pages/inventory/components/inventory-item/inventory-item.component';
import { InventoryTableComponent } from './pages/inventory/components/inventory-table/inventory-table.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LogDetailComponent } from './pages/logs/components/log-detail/log-detail.component';
import { LogItemComponent } from './pages/logs/components/log-item/log-item.component';
import { LogTableComponent } from './pages/logs/components/log-table/log-table.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ReceiptDetailComponent } from './pages/receipts/components/receipt-detail/receipt-detail.component';
import { ReceiptItemComponent } from './pages/receipts/components/receipt-item/receipt-item.component';
import { ReceiptTableComponent } from './pages/receipts/components/receipts-table/receipt-table.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { ModifyTypeComponent } from './pages/types/components/modify-type/modify-type.component';
import { TypeDetailComponent } from './pages/types/components/type-detail/type-detail.component';
import { TypeItemComponent } from './pages/types/components/type-item/type-item.component';
import { TypeTableComponent } from './pages/types/components/type-table/type-table.component';
import { TypesComponent } from './pages/types/types.component';
import { ModifyUserComponent } from './pages/users/components/modify-user/modify-user.component';
import { UserDetailComponent } from './pages/users/components/user-detail/user-detail.component';
import { UserItemComponent } from './pages/users/components/user-item/user-item.component';
import { UserTableComponent } from './pages/users/components/user-table/user-table.component';
import { UsersComponent } from './pages/users/users.component';
import { MatchFilterCardPipe } from './pipes/match-filter-card.pipe';
import { MatchFilterDeliveryPipe } from './pipes/match-filter-delivery.pipe';
import { MatchFilterDocumentPipe } from './pipes/match-filter-document.pipe';
import { MatchFilterInventoryPipe } from './pipes/match-filter-inventory.pipe';
import { MatchFilterLogPipe } from './pipes/match-filter-log.pipe';
import { MatchFilterReceiptPipe } from './pipes/match-filter-receipt.pipe';
import { MatchFilterTypePipe } from './pipes/match-filter-type.pipe';
import { MatchFilterUserPipe } from './pipes/match-filter-user.pipe';
import { routing } from './routing';
import { DataService } from './services/data.service';
import { HttpService } from './services/http.service';
import { ModalService } from './services/modal.service';
import { RouteDataService } from './services/route-data.service';
import { UtilitiesService } from './services/utilities.service';
import { InventoryVerificationModalComponent } from './pages/inventory/components/inventory-verification-modal/inventory-verification-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentsComponent,
    ReceiptsComponent,
    LogsComponent,
    CardsComponent,
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
    CardHistoryTableComponent,
    CardHistoryItemComponent,
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
    PdfGenerationModalComponent,
    InventoryVerificationModalComponent
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
    { provide: LOCALE_ID, useValue: 'sv' }
  ],
  entryComponents: [],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
