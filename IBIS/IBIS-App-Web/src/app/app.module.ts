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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatExpansionModule} from '@angular/material/expansion';
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
import { RecipesComponent } from './recipes/recipes.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { CreateSupplierOrderComponent } from './create-supplier-order/create-supplier-order.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { ViewWriteOffsComponent } from './view-write-offs/view-write-offs.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReportsComponent } from './reports/reports.component';
import { InventoryComponent } from './inventory/inventory.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HomeComponent } from './home/home.component';
import { ProductReportComponent } from './product-report/product-report.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCustomerOrderComponent } from './add-customer-order/add-customer-order.component';
import { AuthenticationService } from './Services/authentication.service';
import { OtpComponent } from './otp/otp.component';
import { AuthGuardService } from './Services/auth-guard.service';
import { ViewImageComponent } from './view-image/view-image.component';
import { AddSupplierOrderComponent } from './add-supplier-order/add-supplier-order.component';
import { ViewCustomerOrderComponent } from './view-customer-order/view-customer-order.component';
import { ViewSupplierOrderComponent } from './view-supplier-order/view-supplier-order.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HelpFunctionComponent } from './help-function/help-function.component';
import { MatButtonModule } from '@angular/material/button';
import { TimerComponent } from './timer/timer.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { PaymentComponent } from './payment/payment.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ProfileComponent } from './profile/profile.component';
//import { QrScannerComponent } from 'angular2-qrscanner';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { InventoryHelpComponent } from './inventory-help/inventory-help.component';
import { RegisterHelpComponent } from './register-help/register-help.component';
import { ReviewComponent } from './review/review.component';
//import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { Home2Component } from './home2/home2.component';
import { HelpMeComponent } from './help-me/help-me.component';
import {MatRadioModule} from '@angular/material/radio';
import { AddUserComponent } from './add-user/add-user.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule, matTooltipAnimations } from '@angular/material/tooltip';
import { CustomerHelpComponent } from './customer-help/customer-help.component';
import { PaymentHelpComponent } from './payment-help/payment-help.component';
import { ProfileHelpComponent } from './profile-help/profile-help.component';
import { HomeHelpComponent } from './home-help/home-help.component';
import { CalenderHelpComponent } from './calender-help/calender-help.component';




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
    OrderFromSupplierComponent,
    CreateRecipeComponent,
    ViewRecipeComponent,
    CreateSupplierOrderComponent,
    CustomerOrderComponent,
    ViewWriteOffsComponent,
    ReportsComponent,
    InventoryComponent,
    RecipesComponent,
    OrdersComponent,
    ProductsComponent,
    SuppliersComponent,
    HomeComponent,
    ProductReportComponent,
    CustomersComponent,
    AddCustomerComponent,
    ViewCustomerComponent,
    AddCustomerOrderComponent,
    WriteOffComponent,
    OtpComponent,
    ViewImageComponent,
    AddSupplierOrderComponent,
    ViewCustomerOrderComponent,
    ViewSupplierOrderComponent,
    AddSupplierComponent,
    AddInventoryItemComponent,
    HelpFunctionComponent,
    ReportsComponent,
    TimerComponent,
    AddCategoryComponent,
    AddSubCategoryComponent,
    CustomerViewComponent,
    PaymentComponent,
    ProfileComponent,
    InventoryHelpComponent,
    RegisterHelpComponent,
    ReviewComponent,
    Home2Component,
    HelpMeComponent,
    ViewUserComponent,
    AddUserComponent,
    CalendarComponent,
    CalendarModalComponent,
    CustomerHelpComponent,
    PaymentHelpComponent,
    ProfileHelpComponent,
    HomeHelpComponent,
    CalenderHelpComponent
   
    
  
  ],
  imports: [
    BrowserModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    QRCodeModule,
    NgQrScannerModule,
    
    //BarcodeScannerLivestreamModule,
    MatRadioModule, //https://webartdevelopers.com/blog/pure-css-radio-button-dot-slider/ for idea of slideshow buttons....
    RouterModule.forRoot([
      {path: '', redirectTo: '/Login', pathMatch: 'full'},
      {path: 'Login', component: LoginComponent, canActivate : [AuthGuardService] },
      {path: 'Register', component: RegisterComponent},
      {path: 'view-supplier/:id', component: ViewSupplierComponent, canActivate : [AuthGuardService]},
      {path: 'add-supplier', component: AddSupplierComponent, canActivate : [AuthGuardService]},
      {path: 'add-product', component: AddProductComponent, canActivate : [AuthGuardService]},
      {path: 'view-product/:id', component: ViewProductComponent, canActivate : [AuthGuardService]},
      {path: 'viewUser', component: ViewUserComponent, canActivate : [AuthGuardService]},
      {path: 'newPassword', component: NewPasswordComponent},
      {path: 'add-inventory-item', component: AddInventoryItemComponent, canActivate : [AuthGuardService]},
      {path: 'view-inventory-item/:id', component: ViewInventoryItemComponent, canActivate : [AuthGuardService]},
      {path: 'add-order', component: AddOrderComponent, canActivate : [AuthGuardService]},
      {path: 'view-order/:id', component: ViewOrderComponent, canActivate : [AuthGuardService]},
      //{path: 'write-off/:id', component: WriteOffComponent, canActivate : [AuthGuardService]},
      {path: 'write-off', component: WriteOffComponent, canActivate : [AuthGuardService]},
      {path: 'order-from-supplier/:id', component: OrderFromSupplierComponent},
      {path: 'Recipes', component: RecipesComponent, canActivate : [AuthGuardService]},
      {path: 'create-recipe', component: CreateRecipeComponent, canActivate : [AuthGuardService]},
      {path: 'view-recipe/:id', component: ViewRecipeComponent, canActivate : [AuthGuardService]},
      {path: 'create-supplier-order/:id', component: CreateSupplierOrderComponent, canActivate : [AuthGuardService]},
      {path: 'create-customer-order', component: CustomerOrderComponent, canActivate : [AuthGuardService]},
      {path: 'view-write-off', component: ViewWriteOffsComponent, canActivate : [AuthGuardService]},
      {path: 'Reports', component: ReportsComponent, canActivate : [AuthGuardService]},
      {path: 'Inventory', component: InventoryComponent, canActivate : [AuthGuardService]},
      {path: 'Orders', component: OrdersComponent, canActivate : [AuthGuardService]},
      {path: 'Recipes', component: RecipesComponent, canActivate : [AuthGuardService]},
      {path: 'Products', component: ProductsComponent, canActivate : [AuthGuardService]},
      {path: 'Suppliers', component: SuppliersComponent, canActivate : [AuthGuardService]},
      //{path: 'home', component:HomeComponent, canActivate : [AuthGuardService]},
      {path: 'home', component:Home2Component, canActivate : [AuthGuardService]},
      {path: 'product-report', component: ProductReportComponent},
      {path: 'customer', component: CustomersComponent,canActivate : [AuthGuardService]},
    {path: 'otp', component: OtpComponent, canActivate : [AuthGuardService]},
      {path: 'otp/:username', component: OtpComponent,canActivate : [AuthGuardService]},
      //{path:'view-write-off/:id',component:ViewWriteOffsComponent,canActivate : [AuthGuardService]},
      {path: 'timer', component: TimerComponent,canActivate : [AuthGuardService]},
      //{path: 'timer/:username', component: TimerComponent },
      {path: 'customer-view', component: CustomerViewComponent,canActivate : [AuthGuardService]},
      {path: 'payment', component: PaymentComponent,canActivate : [AuthGuardService]},
      {path:'profile',component:ProfileComponent,canActivate : [AuthGuardService]},
      {path:'help-me',component:HelpMeComponent,canActivate : [AuthGuardService]},
      {path: 'calendar', component: CalendarComponent,canActivate : [AuthGuardService]}
      




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
  entryComponents: [AddCustomerComponent,ViewCustomerComponent,AddCustomerOrderComponent,
  ViewImageComponent,AddSupplierComponent,ViewCustomerOrderComponent,ViewSupplierOrderComponent,
  AddSupplierOrderComponent,AddInventoryItemComponent,ViewInventoryItemComponent,ViewSupplierComponent,
AddProductComponent,AddSubCategoryComponent,AddCategoryComponent,ReviewComponent,
ViewUserComponent,AddUserComponent],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthenticationService,multi:true}
  ,AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
