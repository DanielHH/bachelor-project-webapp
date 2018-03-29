import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { CardsComponent } from './pages/cards/cards.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import {
  CardDetailComponent
} from './pages/cards/components/card-detail/card-detail.component';
import {
  DocumentDetailComponent
} from './pages/documents/components/document-detail/document-detail.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { name: 'Startsidan' }, canActivate: [AuthGuard] },
    { path: 'documents', component: DocumentsComponent, data: { name: 'Handlingar' }, canActivate: [AuthGuard] },
    { path: 'receipts', component: ReceiptsComponent, data: { name: 'Kvittenser' }, canActivate: [AuthGuard] },
    { path: 'logs', component: LogsComponent, data: { name: 'Loggar' }, canActivate: [AuthGuard] },
    { path: 'examples', component: ExamplesComponent, data: { name: 'Kodexempel' } },
    { path: 'cards', component: CardsComponent, data: { name: 'Kort' }, canActivate: [AuthGuard] },
    { path: 'deliveries', component: DeliveriesComponent, data: { name: 'Leveranser' }, canActivate: [AuthGuard] },
    { path: 'inventory', component: InventoryComponent, data: { name: 'Inventarie' }, canActivate: [AuthGuard] },
    { path: 'card-detail', component: CardDetailComponent, data: {name: 'Kortdetaljer'}, canActivate: [AuthGuard] },
    { path: 'document-detail',
      component: DocumentDetailComponent,
      data: {name: 'Dokumentdetaljer'}
    },
    {
      path: 'login',
      component: LoginComponent,
      data: { name: 'Inloggning'}
    }


  /* Resterande routes
  { path: '**',
    component: PageNotFoundComponent,
    data: { name: 'SidanHittadesInte', fullSizeBackgroundURL: '/assets/not-found.jpg' } }
  */
];

export const routing: ModuleWithProviders = RouterModule.forRoot(
  routes, { useHash: false }
);
