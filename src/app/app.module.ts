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
import { AddNewCardComponent } from './pages/cards/components/add-new-card/add-new-card.component';
import { CardTableComponent } from './pages/cards/components/card-table/card-table.component';
import { CardItemComponent } from './pages/cards/components/card-item/card-item.component';
import { CardDetailComponent } from './pages/cards/components/card-detail/card-detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { CardTypeValidatorDirective } from './directives/card-type.directive';
import { UsernameValidatorDirective } from './directives/username.directive';
import { ExpirationDateValidatorDirective } from './directives/expiration-date.directive';
import { DataService } from './services/data.service';
import { MatchFilterPipe } from './pipes/match-filter.pipe';

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
    AddNewCardComponent,
    CardTableComponent,
    CardItemComponent,
    UsernameValidatorDirective,
    CardTypeValidatorDirective,
    ExpirationDateValidatorDirective,
    MatchFilterPipe,
    CardDetailComponent
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
    MatDialogModule
  ],
  providers: [HttpService, DataService],
  entryComponents: [AddNewCardComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
