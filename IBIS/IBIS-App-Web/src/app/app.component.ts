import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationStart, Router } from '@angular/router';
import { LoginService } from './Services/login.service';



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
export class AppComponent implements OnInit {
  logged=false;
  search : String ="";
  showNavigation:any
  selectedValue:any

constructor(private log : LoginService, public router: Router,){

}
  ngOnInit(): void {

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/Login' || event['url'] == '/Register') {
          this.showNavigation = false;
        } else {
          // console.log("NU")
          this.showNavigation = true;
        }
      }
    })
    
  }
  panelOpenState = false;
  title = 'IBIS-App';
  use: userprofile[] = [
    {value: 'user-0', viewValue: 'Display Settings',route: 'Dashboard'},
    {value: 'user-1', viewValue: 'Profile',route: 'viewUser'},
    {value: 'user-2', viewValue: 'Logout',route: 'Login'},
  ];
  tabs: TabItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: 'home',
    },
    {
      label: 'Inventory',
      icon: 'inventory',
      route: 'Inventory',
    },
    {
      label: 'Products',
      icon: 'kitchen',
      route: 'Products',
    },
    {
      label: 'Suppliers',
      icon: 'local_grocery_store',
      route: 'Suppliers',
    },
    {
      label: 'Reports',
      icon: 'report',
      route: 'Reports',
    },
    {
      label: 'Orders',
      icon: 'price_change ',
      route: 'Orders',
    },
    {
      label: 'Recipes',
      icon: 'playlist_add_check',
      route: 'Recipes',
    },
    {
      label: 'Customers',
      icon: 'people',
      route: 'customer',
    }
  
  ];
  IsLogOut(){
  if(this.selectedValue == 'user-2'){
    localStorage.removeItem('Token')
    this.router.navigate(['/Login'])
  }
  }

}


