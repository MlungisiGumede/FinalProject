import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InventoryHelpComponent } from '../inventory-help/inventory-help.component';
import { RecipesHelpComponent } from '../recipes-help/recipes-help.component';
import { OrdersHelpComponent } from '../orders-help/orders-help.component';
import { SupplierHelpComponent } from '../supplier-help/supplier-help.component';
import { ProductsHelpComponent } from '../products-help/products-help.component';

@Component({
  selector: 'app-help-me',
  templateUrl: './help-me.component.html',
  styleUrls: ['./help-me.component.css']
})
export class HelpMeComponent implements OnInit {
  filterTerm!: string;

  constructor(public helpModal: ModalController) { }

  ngOnInit(): void {
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









}
