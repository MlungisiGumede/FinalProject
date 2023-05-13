import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  redirectTo: 'one',
},
{
  path: 'Login',
  loadChildren: () =>
  import('./Login.module').then(
    (m) => m.LoginModule
  )
},
{
  path: 'Home',
  loadChildren: () =>
    import('./home.module').then(
      (m) => m.HomeModule
    ),
},
{
  path: 'Create-User-Account',
  loadChildren: () =>
    import('./create-user-account.module').then(
      (m) => m.CreateUserAccountModule
    ),
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
