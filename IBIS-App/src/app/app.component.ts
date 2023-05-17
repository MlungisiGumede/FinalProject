import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';




export interface TabItem {
  label: string;
  icon: string;
  route: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IBIS-App';
  tabs: TabItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'Dashboard',
    },
    {
      label: 'Inventory',
      icon: 'inventory',
      route: 'Inventory',
    },
    {
      label: 'Products',
      icon: 'product',
      route: 'Products',
    },
    {
      label: 'Suppliers',
      icon: 'supplier',
      route: 'Suppliers',
    },
    {
      label: 'Reports',
      icon: 'report',
      route: 'Reports',
    },
    {
      label: 'Orders',
      icon: 'order',
      route: 'Orders',
    },
    {
      label: 'Recipes',
      icon: 'recipe',
      route: 'Recipes',
    },
  ];
}


