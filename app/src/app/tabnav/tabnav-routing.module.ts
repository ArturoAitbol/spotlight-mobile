import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../security/role.guard';
import { ServiceGuard } from '../security/service.guard';

import { TabnavPage } from './tabnav.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabnavPage,
    canActivate:[RoleGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule),
        canActivate:[RoleGuard,ServiceGuard]
      },
      {
        path: 'notes',
        loadChildren: () => import('../notes/notes.module').then(m => m.SettingsPageModule),
        canActivate:[RoleGuard,ServiceGuard]
      },
      {
        path: 'ctaas-dashboard',
        loadChildren: () => import('../ctaas-dashboard/ctaas-dashboard.module').then(m => m.CtaasDashboardPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabnavPageRoutingModule { }
