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
{
  path: 'Dashboard',
  loadChildren: () =>
    import('./ComponentModules/dashboard.module').then(
      (m) => m.DashboardModule
    ),
},
{
  path: 'Inventory',
  loadChildren: () =>
    import('./ComponentModules/inventory.module').then(
      (m) => m.InventoryModule
    ),
},
{
  path: 'Products',
  loadChildren: () =>
    import('./ComponentModules/products.module').then(
      (m) => m.ProductsModule
    ),
},
{
  path: 'Orders',
  loadChildren: () =>
    import('./ComponentModules/orders.module').then(
      (m) => m.OrderModule
    ),
},

{
  path: 'Suppliers',
  loadChildren: () =>
    import('./ComponentModules/suppliers.module').then(
      (m) => m.SuppliersModule
    ),
},
{
  path: 'Reports',
  loadChildren: () =>
    import('./ComponentModules/reports.module').then(
      (m) => m.ReportsModule
    ),
},
{
path: 'Recipes',
loadChildren: () =>
  import('./ComponentModules/recipes.module').then(
    (m) => m.RecipesModule
  ),
},
  {
    path: 'AddProduct',
    loadChildren: () =>
      import('./ComponentModules/CreateProduct.module').then(
        (m) => m.CreateProductModule
      ),
  },
  {
    path: 'add-Product',
    loadChildren: () =>
      import('./ComponentModules/add-product.module').then(
        (m) => m.AddProductModule
      ),
  }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
