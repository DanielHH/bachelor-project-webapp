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
import { AuthGuard } from './auth/auth.guard';
import { SelfVerificationComponent } from './pages/self-verification/self-verification.component';
import { TypesComponent } from './pages/types/types.component';

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
  /*{
    path: 'card-history',
    component: CardHistoryComponent,
    data: { name: 'Korthistorik', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'document-history',
    component: DocumentHistoryComponent,
    data: { name: 'Dokumenthistorik', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },*/
  {
    path: 'self-verification',
    component: SelfVerificationComponent,
    data: { name: 'Egenkontroll', validUserTypes: [2] },
    canActivate: [AuthGuard]
  },
  {
    path: 'types',
    component: TypesComponent,
    data: { name: 'Typer', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  /*{
    path: 'users',
    component: UsersComponent,
    data: { name: 'Användare', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },*/
  { path: '**', component: HomeComponent, data: { name: 'Startsidan' }, canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  useHash: false
});
