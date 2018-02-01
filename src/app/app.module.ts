import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './components/app/app.component';
import { routing } from './routing';


import { HomeComponent } from './pages/home/home.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentsComponent,
    ReceiptsComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    routing,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
