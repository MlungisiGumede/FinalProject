import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';




export interface TabItem {
  label: string;
  icon: string;
  route: string;
}
export interface userprofile {
  value: string;
  viewValue: string;
  route: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  panelOpenState = false;
  title = 'IBIS-App';
  use: userprofile[] = [
    {value: 'user-0', viewValue: 'Display Settings',route: 'Dashboard'},
    {value: 'user-1', viewValue: 'Profile',route: 'Products'},
    {value: 'user-2', viewValue: 'Logout',route: 'Suppliers'},
  ];
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


