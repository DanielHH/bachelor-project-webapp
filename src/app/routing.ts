import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { CardsComponent } from './pages/cards/cards.component';
import { CardDetailComponent } from './pages/cards/components/card-detail/card-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { name: 'Startsidan' } },
    { path: 'documents', component: DocumentsComponent, data: { name: 'Handlingar' } },
    { path: 'receipts', component: ReceiptsComponent, data: { name: 'Kvittenser' } },
    { path: 'logs', component: LogsComponent, data: { name: 'Loggar' } },
    { path: 'examples', component: ExamplesComponent, data: { name: 'Kodexempel' } },
    { path: 'cards', component: CardsComponent, data: { name: 'Kort' } },
    { path: 'detail', component: CardDetailComponent, data: {name: 'Kortdetaljer'} }

  /* Resterande routes
	{ path: '**', component: PageNotFoundComponent, data: { name: 'SidanHittadesInte', fullSizeBackgroundURL: '/assets/not-found.jpg' } }
  */
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
