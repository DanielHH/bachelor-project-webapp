import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ReceiptsComponent } from './pages/receipts/receipts.component';
import { LogsComponent } from './pages/logs/logs.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { CardsComponent } from './pages/cards/cards.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { name: 'Startsidan' }
  },

  {
    path: 'documents',
    component: DocumentsComponent,
    data: { name: 'Handlingar' },
    canActivate: [AuthGuard]
  },

  {
    path: 'receipts',
    component: ReceiptsComponent,
    data: { name: 'Kvittenser' },
    canActivate: [AuthGuard]
  },

  {
    path: 'logs',
    component: LogsComponent,
    data: { name: 'Loggar' },
    canActivate: [AuthGuard]
  },

  {
    path: 'examples',
    component: ExamplesComponent,
    data: { name: 'Kodexempel'},
    canActivate: [AuthGuard]
  },

  {
    path: 'cards',
    component: CardsComponent,
    data: { name: 'Kort' },
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    component: LoginComponent,
    data: { name: 'Inloggning'}
  }


  /* Resterande routes
	{ path: '**', component: PageNotFoundComponent, data: { name: 'SidanHittadesInte', fullSizeBackgroundURL: '/assets/not-found.jpg' } }
  */
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
