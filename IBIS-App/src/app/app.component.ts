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
      label: 'Login',
      icon: 'login',
      route: 'Login',
    },
    {
      label: 'Home',
      icon: 'person',
      route: 'Home',
    },
    {
      label: 'create-user-account',
      icon: 'search',
      route: 'Create-User-Account',
    },
  ];
}


