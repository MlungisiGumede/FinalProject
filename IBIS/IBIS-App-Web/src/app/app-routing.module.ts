import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'one',
  }*/
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
{
  path: 'Create-User-Account',
  loadChildren: () =>
    import('./create-user-account.module').then(
      (m) => m.CreateUserAccountModule
    ),
},
{
  path: 'Dashboard',
  loadChildren: () =>
    import('./ComponentModules/dashboard.module').then(
      (m) => m.DashboardModule
    ),
},
// {
//   path: 'Product-Report',
//   loadChildren: () =>
//     import('./ComponentModules/ProductReport.module').then(
//       (m) => m.ProductReportModule
//     )
// },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
