import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';

const config: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  initialNavigation: !BrowserUtils.isInIframe() ? 'enabledNonBlocking' : 'disabled', // Don't perform initial navigation in iframes
  onSameUrlNavigation: 'reload',
  useHash: true,
};

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./redirect/redirect.module').then(m => m.RedirectPageModule),
    canActivate:[MsalGuard]
  },
  {
  path: 'tabs',
  loadChildren: () => import('./tabnav/tabnav.module').then(m => m.TabnavPageModule),
  canActivate:[MsalGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  { path: '**', redirectTo: '' },
  {
    path: 'ctaas-dashboard',
    loadChildren: () => import('./ctaas-dashboard/ctaas-dashboard.module').then( m => m.CtaasDashboardPageModule)
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,config)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
