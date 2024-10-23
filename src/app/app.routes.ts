import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'money-request',
    loadComponent: () => import('./pages/money-request/money-request.page').then( m => m.MoneyRequestPage)
  },
  {
    path: 'historical',
    loadComponent: () => import('./pages/historical/historical.page').then( m => m.HistoricalPage)
  },
  {
    path: 'approvals',
    loadComponent: () => import('./pages/approvals/approvals.page').then( m => m.ApprovalsPage)
  },  {
    path: 'config',
    loadComponent: () => import('./pages/config/config.page').then( m => m.ConfigPage)
  },


];
