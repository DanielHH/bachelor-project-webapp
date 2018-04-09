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
import { CardDetailComponent } from './pages/cards/components/card-detail/card-detail.component';
import { CardhistoryComponent } from './pages/cardhistory/cardhistory.component';
import { DocumentDetailComponent } from './pages/documents/components/document-detail/document-detail.component';
import { AuthGuard } from './auth/auth.guard';
import { SelfVerificationComponent } from './pages/self-verification/self-verification.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { name: 'Startsidan' } },
  {
    path: 'documents',
    component: DocumentsComponent,
    data: { name: 'Handlingar', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'receipts',
    component: ReceiptsComponent,
    data: { name: 'Kvittenser', validUserTypes: [1, 2] },
    canActivate: [AuthGuard]
  },
  {
    path: 'logs',
    component: LogsComponent,
    data: { name: 'Loggar', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'examples',
    component: ExamplesComponent,
    data: { name: 'Kodexempel', validUserTypes: [1] }
  },
  {
    path: 'cards',
    component: CardsComponent,
    data: { name: 'Kort', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveries',
    component: DeliveriesComponent,
    data: { name: 'Leveranser', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    data: { name: 'Inventarie', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'card-detail',
    component: CardDetailComponent,
    data: { name: 'Kortdetaljer', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  { path: 'cardhistory',
    component: CardhistoryComponent,
    data: {name: 'Korthistorik', validUserTypes: [1]}
  },
  {
    path: 'document-detail',
    component: DocumentDetailComponent,
    data: { name: 'Dokumentdetaljer', validUserTypes: [1] }
  },
  {
    path: 'self-verification',
    component: SelfVerificationComponent,
    data: { name: 'Egenkontroll', validUserTypes: [2] }
  },
  { path: '**', component: HomeComponent, data: { name: 'Startsidan' } }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  useHash: false
});
