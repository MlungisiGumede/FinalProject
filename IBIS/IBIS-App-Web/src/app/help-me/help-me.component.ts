import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InventoryHelpComponent } from '../inventory-help/inventory-help.component';
import { RecipesHelpComponent } from '../recipes-help/recipes-help.component';
import { OrdersHelpComponent } from '../orders-help/orders-help.component';
import { SupplierHelpComponent } from '../supplier-help/supplier-help.component';
import { ProductsHelpComponent } from '../products-help/products-help.component';
import { ReportHelpComponent } from '../report-help/report-help.component';
import { HomeHelpComponent } from '../home-help/home-help.component';
import { CalenderHelpComponent } from '../calender-help/calender-help.component';
import { CustomerHelpComponent } from '../customer-help/customer-help.component';

@Component({
  selector: 'app-help-me',
  templateUrl: './help-me.component.html',
  styleUrls: ['./help-me.component.css']
})
export class HelpMeComponent implements OnInit {
  filterTerm!: string;
  options: string[] = ['Orders Help', 'Suppliers Help', 'Inventory Help', 'Products Help', 'Recipes Help', 'Customers Help', 'Report Help',
'Calender Help', 'Home Help'];
  selectedItem: string = '';
  showDropdown: boolean = false;
  filteredOptions: string[] = [];
  helpClicked=false;

  constructor(public helpModal: ModalController) { }

  ngOnInit(): void {
    console.log(this.helpClicked)
  }

  clickedHelpDoc(){
this.helpClicked=true;
  }


  async showInventoryHelp(){
    const modal = await this.helpModal.create({
      component: InventoryHelpComponent});
      return await modal.present();
  }

  async showRecipeHelp(){
    const modal = await this.helpModal.create({
      component: RecipesHelpComponent});
      return await modal.present();
  }

  async showOrdersHelp(){
    const modal = await this.helpModal.create({
      component: OrdersHelpComponent});
      return await modal.present();
  }

  async showSuppliersHelp(){
    const modal = await this.helpModal.create({
      component: SupplierHelpComponent});
      return await modal.present();
  }

  async showProductHelp(){
    const modal = await this.helpModal.create({
      component: ProductsHelpComponent});
      return await modal.present();
  }

  async showCustomerHelp(){
    const modal = await this.helpModal.create({
      component: InventoryHelpComponent});
      return await modal.present();
  }

  async showReportHelp(){
    const modal = await this.helpModal.create({
      component: ReportHelpComponent});
      return await modal.present();
  }
  async showHomePageHelp(){
    const modal = await this.helpModal.create({
      component: HomeHelpComponent});
      return await modal.present();
  }
  async showCalenderHelp(){
    const modal = await this.helpModal.create({
      component: CalenderHelpComponent});
      return await modal.present();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.filteredOptions = [...this.options];
  }

  filterOptions() {
    if (this.selectedItem) {
      this.filteredOptions = this.options.filter(option =>
        option.toLowerCase().includes(this.selectedItem.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  async selectOption(option: string) {
    this.selectedItem = option;


if(option == 'Orders Help'){
  const modal = await this.helpModal.create({
    component: OrdersHelpComponent});
    return await modal.present();

}

if(option == 'Suppliers Help'){
  const modal = await this.helpModal.create({
    component: SupplierHelpComponent});
    return await modal.present();

}
if(option == 'Inventory Help'){
  const modal = await this.helpModal.create({
    component: InventoryHelpComponent});
    return await modal.present();

}

if(option == 'Recipes Help'){
  const modal = await this.helpModal.create({
    component: RecipesHelpComponent});
    return await modal.present();

}
if(option == 'Customers Help'){
  const modal = await this.helpModal.create({
    component: CustomerHelpComponent});
    return await modal.present();

}
if(option == 'Calender Help'){
  const modal = await this.helpModal.create({
    component: CalenderHelpComponent});
    return await modal.present();

}
if(option == 'Products Help'){
  const modal = await this.helpModal.create({
    component: ProductsHelpComponent});
    return await modal.present();

}
if(option == 'Home Help'){
  const modal = await this.helpModal.create({
    component: HomeHelpComponent});
    return await modal.present();

}
if(option == 'Report Help'){
  const modal = await this.helpModal.create({
    component: ReportHelpComponent});
    return await modal.present();

}

    this.showDropdown = false;
  }

}
