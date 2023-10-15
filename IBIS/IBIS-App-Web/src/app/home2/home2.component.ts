import { Component, OnInit,ViewChild,ChangeDetectorRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, mergeMap, of, throwError, timer } from 'rxjs';
import { ViewUserComponent } from '../view-user/view-user.component';
import { LoginService } from '../Services/login.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeHelpComponent } from '../home-help/home-help.component';
import { ModalController } from '@ionic/angular';
import { NgImageSliderComponent } from 'ng-image-slider/public_api';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
request:any
data:any = of([{}])
filterTerm!: string
permissions:any
role:any
isVideo:any = true
sliderLoaded:any
infinite:any = true
enabled:any = true
count:any = 0
timer:any
@ViewChild('nav',{static:false}) slider!: NgImageSliderComponent;
imageObject:any = [
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/5.jpg',
    title: 'Hummingbirds are amazing creatures',
  },
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/9.jpg',
  },
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/4.jpg',
    title: 'Example with title.',
  },
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg',
    title: 'Hummingbirds are amazing creatures',
  },
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/1.jpg',
  },
  {
    image:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg',
    thumbImage:
      'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/2.jpg',
    title: 'Example two with title.',
  },
];
imageObject2:any = [
  {
    image:
      './assets/butchery.jpg',
    thumbImage:
      './assets/butchery.jpg',
    
  }
]
  constructor(public matDialog:MatDialog,public logInService:LoginService, public helpModal: ModalController,
    public router:Router,private _snackbar: MatSnackBar,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isVideo = false
    
    //this.slider. = false
    
    //this.sliderLoaded = true
    //this.slider.autoSlide = false
    
    
    //this.slider.imageAutoSlide
   this.GetUsers()
   
  }
  ngAfterViewInit(){
    console.log(this.slider)
    
    this.slider.stopSlideOnHover = false
    this.slider.showArrow = false
    this.slider.infinite = false
    //this.slider.manageImageRatio = true
    //this.slider.
    this.slider.ngAfterViewInit()
    let val = this.logInService.isVideo.subscribe((result:any)=>{
      this.isVideo = result
      console.log(result)
      if(result){
        this.ToVideo()
      }else{
        this.NotVideo()
      }
    })
   
   
  }
  ToVideo(){
   this.slider.showArrow = true
   this.slider.infinite = false
  
  this.timer.unsubscribe()
  setTimeout( ()=> {
    this.logInService.isVideo.subscribe((result:any)=>{
      console.log(result)
      if(!result){
        this.logInService.isVideo.next(true)
      }
    })
   
}, 0 );
  this.slider.animationSpeed = 1
  //this.slider.
  //this.slider.sliderNextDisable = true
 
// this.slider.animationSpeed = 5
// //this.slider.slideImage = 1
// this.slider.infinite = false
// this.slider.sliderNextDisable = true
// this.slider.stopSlideOnHover = true
// //this.slider.autoSlideCount = 5
// this.slider.showArrow = true
//  console.log(this.slider.autoSlideCount)
//  //this.slider.close()
//  console.log(this.slider.imageClick)

//  console.log(this.slider.activeImageIndex)
//  //console.log(this.slider.)
//  //this.slider.next()
// this.imageObject[5].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[5].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// //this.imageObject[5].title = 'Thanks For watching'
// this.imageObject[4].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// //this.imageObject[4].title = 'Thanks For watching'
// this.imageObject[4].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// //this.imageObject[3].title = 'Thanks For watching'
// this.imageObject[3].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[3].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[2].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// //this.imageObject[2].title = 'Thanks For watching'
// this.imageObject[2].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[1].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[1].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'

// this.imageObject[0].image =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// this.imageObject[0].thumbImage =   'https://sanjayv.github.io/ng-image-slider/contents/assets/img/slider/7.jpg'
// //this.slider.setSliderImages(this.imageObject)
// //this.slider.slideImage = 6
// //this.slider.sliderOrderType = 'DESC'
// if(this.slider.activeImageIndex == -1){
//   this.slider.slideImage = 6
//  }else{
//   this.slider.slideImage = 6
//  }
//  if(this.slider.activeImageIndex == -1){
//   this.slider.slideImage = 6
//  }else{
//   this.slider.slideImage = 6
//  }

//  if(this.slider.activeImageIndex == -1){
//   this.slider.slideImage = 6
//  }else{
//   this.slider.slideImage = 6
//  }
//  if(this.slider.activeImageIndex == -1){
//   this.slider.slideImage = 6
//  }else{
//   this.slider.slideImage = 6
//  }
 
//this.enabled = false
  //this.slider.setSliderImages(imageObj)
  
   
   
  }
  @HostListener('window:resize', ['$event'])
onResize(event:any) {
  this.timer.unsubscribe()
  //this.logInService.isVideo.next(true)
  this.slider.handleKeyboardEvent(event)
  //this.slider.setSlid 1erWidth()
  this.slider.showArrow = true
  this.slider.infinite = false
  //this.slider.sw
  this.slider.animationSpeed = 1
 this.slider.imageSize = {'width':event.target.outerWidth}
  this.slider.sliderImageWidth = event.target.outerWidth
  this.slider.sliderImageReceivedWidth = event.target.outerWidth
  this.slider.sliderImageSizeWithPadding = 0
  this.slider.autoSlide = false
  this.slider.sliderNextDisable = true
  this.slider.sliderPrevDisable = true
  this.slider.stopSlideOnHover = true
}
@HostListener('touchend', ['$event']) onSwipeEnd($event:any) {
 alert("swipe")
}
  NotVideo(){
    const reloadInterval = 960;

    
    this.timer = timer(0, reloadInterval).pipe(
       mergeMap(_ => of(this.slider.next()))
     ).subscribe(()=>{
       this.count++
   if(this.count == 2){
     this.slider.infinite = true
   }
     })
    //this.timer.subscribe()
    //this.slider.close()
    //this.enabled = true
    //this.slider.ngAfterViewInit()
    //this.slider.
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: HomeHelpComponent});
      return await modal.present();
  }
  View(user:any){
   const dialogRef = this.matDialog.open(ViewUserComponent,{
    data:{'user':user,'disable':false}
   })
   dialogRef.afterClosed().subscribe((res:any) => {
      
    if(res){
      this.GetUsers()
      this.ShowSnackBar("User Successfully Edited", "success");
    
    }else if(res == false){
      this.ShowSnackBar("Failed to Edit User", "error");
    }
  })
  }
  Add(){
    const dialogRef = this.matDialog.open(AddUserComponent,{
      
     })
     dialogRef.afterClosed().subscribe((res:any) => {
      
        if(res){
          this.GetUsers()
          this.ShowSnackBar("User Successfully Added", "success");
        
        }else if(res == false){
          this.ShowSnackBar("Failed to Add User", "error");
        }
      })
    }

    ShowSnackBar(message: string, panel: string) {
      this._snackbar.open(message, "close", {
        duration: 5000,
        panelClass: [panel]
        
      });
    }
     
  
  DeleteUser(item:any){
  
    this.logInService.DeleteUser(item).pipe(map(
      (res)=>{

    }),
    catchError((err) =>{
      console.log(err)
    
        this.ShowSnackBar("failed to remove user", "error");
      
      
      return throwError(err)
    })).subscribe(res=>{
      this.ShowSnackBar("user successfully removed", "success");
      this.GetUsers()
    })
  
  }
  GetUsers(){
    this.logInService.getAllUsers().subscribe(res=>{
      this.data = of(res)
      this.GetUserRole()
      console.log(res)
    })
  }
  async GetUserRole(){
    let value = new Promise((resolve, reject) => {
      this.logInService.GetUserRole().subscribe((res) => {
        this.permissions = res.permissions
        this.role = res.role
        console.log(res)
       //alert(this.permissions)
        resolve(res)
      }), (error: any) => {
        reject(error)
      }
    })
    await value
    return value
  }
  CheckPermission(input:any){
   
      if(this.role == "manager"){
        
        return true
       }
    let index = this.permissions.findIndex((element:any) => element.permission_ID == input)
        console.log(index)
      if(index > -1){
        return true
      }else{
       
        return false
      }
   
    
}
Navigate(){
  this.router.navigate(['/calendar'])
}
navigateAudit(){
  this.router.navigate(['/audit'])
}
  UpdateRole(user:any){
    const dialogRef = this.matDialog.open(ViewUserComponent,{
     data:{'user':user,'disable':true}
    })
   }

}
