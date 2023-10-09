import { Component, OnInit, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationError, NavigationStart, Router } from '@angular/router';
import { LoginService } from './Services/login.service';
import { AuthenticationService } from './Services/authentication.service';
import { AuthGuardService } from './Services/auth-guard.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { MatSelect } from '@angular/material/select';



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
  public showNavigation:any
  selectedValue:any
  url:any
  showLogOut:any
  @ViewChild('selector', { static: false }) selector!: MatSelect
constructor(private loginService : LoginService, public router: Router,
  private authenticationService: AuthenticationService,
  private authGuardService:AuthGuardService,private spinner: NgxSpinnerService) {

}
  ngOnInit(): void {
    //this.spinner.show()
  this.authGuardService.showNavigation.subscribe((showNavigation) => {
    this.showNavigation = showNavigation
  })
  
  this.authGuardService.showLogOut.subscribe((showLogOut) => {
    console.log(showLogOut)
    this.showLogOut = showLogOut
  })
//     this.router.events.forEach((event) => {
//       if (event instanceof NavigationStart) {
//         console.log(event['url'])
          
//           // console.log("NU")
//           this.authenticationService.Authenticate().then((success) => {
//             this.showNavigation = true;
//           }, (error) => {
//             if(error.status == 401){
//               this.showNavigation = false;
//             }else{
//               this.showNavigation = true;
//             }
           
//           })
//           //this.showNavigation = true;
//       if(event instanceof NavigationError){
//         this.showNavigation = false;
//     }
//   }
// })
} 

    
    
  // })
      
  
  panelOpenState = false;
  title = 'IBIS-App';
  use: userprofile[] = [
    {value: 'user-0', viewValue: 'Display Settings',route: 'Dashboard'},
    {value: 'user-1', viewValue: 'Profile',route: 'profile'},
    {value: 'user-2', viewValue: 'Logout',route: 'Login'},
    {value: 'user-3', viewValue: 'Help',route: 'help-me'},
  ];
  tabs: TabItem[] = [
    {
      label: 'Home',
      icon: 'home',
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
    if(this.selectedValue == 'user-1'){
      this.router.navigate(['/profile'])
    }
   
  if(this.selectedValue == 'user-2'){
    localStorage.removeItem('Token')
    //localStorage.removeItem('OTP')
    this.showNavigation = false
    this.showLogOut = false
   
    //this.authGuardService.ShowNavigation()
    this.router.navigate(['/Login'])
  }if(this.selectedValue == 'user-3'){
    this.router.navigate(['/help-me'])
  }
  this.selectedValue = undefined
  this.selector.close()
  }

}


