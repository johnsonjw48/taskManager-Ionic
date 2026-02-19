import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { publicGuard } from './core/auth/guards/public.guard';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/tasks',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage),
    canActivate: [publicGuard]
  },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];
