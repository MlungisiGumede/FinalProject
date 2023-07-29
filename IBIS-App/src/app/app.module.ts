import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { materialize } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { AddInventoryItemComponent } from './add-inventory-item/add-inventory-item.component';
import { IonicModule } from '@ionic/angular';
import { ViewInventoryItemComponent } from './view-inventory-item/view-inventory-item.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { WriteOffComponent } from './write-off/write-off.component';
import { OrderFromSupplierComponent } from './order-from-supplier/order-from-supplier.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewProductComponent,
    ViewSupplierComponent,
    AddSupplierComponent,
    LoginComponent,
    RegisterComponent,
    AddProductComponent,
    ViewUserComponent,
    NewPasswordComponent,
    AddInventoryItemComponent,
    ViewInventoryItemComponent,
    ViewOrderComponent,
    AddOrderComponent,
    WriteOffComponent,
    OrderFromSupplierComponent
  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/Login', pathMatch: 'full'},
      {path: 'Login', component: LoginComponent},
      {path: 'Register', component: RegisterComponent},
      {path: 'view-supplier/:id', component: ViewSupplierComponent},
      {path: 'add-supplier', component: AddSupplierComponent},
      {path: 'add-product', component: AddProductComponent},
      {path: 'view-product/:id', component: ViewProductComponent},
      {path: 'viewUser', component: ViewUserComponent},
      {path: 'newPassword', component: NewPasswordComponent},
      {path: 'add-inventory-item', component: AddInventoryItemComponent},
      {path: 'view-inventory-item/:id', component: ViewInventoryItemComponent},
      {path: 'add-order', component: AddOrderComponent},
      {path: 'view-order/:id', component: ViewOrderComponent}




    ]),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatSortModule,
    ReactiveFormsModule,
    MatExpansionModule,
    IonicModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
