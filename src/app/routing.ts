import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CardHistoryComponent } from './pages/cardhistory/cardhistory.component';
import { CardsComponent } from './pages/cards/cards.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DocumentHistoryComponent } from './pages/document-history/document-history.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { TypesComponent } from './pages/types/types.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { name: 'SecTrack' } },
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
    data: { name: 'Inventarie', validUserTypes: [1, 2] },
    canActivate: [AuthGuard]
  },
  {
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
  },
  {
    path: 'types',
    component: TypesComponent,
    data: { name: 'Typer', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { name: 'Användare', validUserTypes: [1] },
    canActivate: [AuthGuard]
  },
  { path: '**', component: HomeComponent, data: { name: 'SecTrack' }, canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  useHash: false
});
