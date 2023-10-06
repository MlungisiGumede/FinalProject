import { Component, OnInit } from '@angular/core';
import { LoginService } from '../Services/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { RegisterHelpComponent } from '../register-help/register-help.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //registerForm! : FormGroup
  submitted = false;
  isModalOpen = false;

  constructor(private register: LoginService, private fb: FormBuilder,private router:Router, public helpModal: ModalController,
     private _snackbar: MatSnackBar) { }
  registerForm!: FormGroup ;

  ngOnInit(): void {

this.registerForm = this.fb.group({

  username : ['',[ Validators.required,Validators.minLength(6)]],
  password : ['', [Validators.required,Validators.minLength(6)]],
  fullName : ['', Validators.required],
  email: ['',[Validators.required,Validators.email]],
  clientUrl: [environment.clienUrl + 'confirmation'],
  // surname : ['', Validators.required],
  // address : ['', Validators.required],
  // Cellphone_Number : ['', Validators.required]
})


  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  async showHelp(){
    const modal = await this.helpModal.create({
      component: RegisterHelpComponent});
      return await modal.present();
  }

async BackToLogin(){
  console.log("BackToLogin")
  this.router.navigate(['/Login'])
}

onSubmit(){

  this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.warn(this.registerForm.value);

}

  onRegister(){
    this.submitted = true;

    if (this.registerForm.invalid) {
      console.log('register form is:', this.registerForm.value)
      return;
    }
    
    //console.warn(this.registerForm.value);

    this.register.Register(this.registerForm.value).subscribe(
       (res)=>{
        console.log(res)
        localStorage.setItem('emailToken',JSON.stringify(res))
        
        this.ShowSnackBar("User successfully registered", "success")
        //alert(res.message)
       
      //this.router.navigate(['/'])
       },
      (err) =>{
        
        console.log(err)
        this.ShowSnackBar(err.error, "error")
      }
    )
  
  
  
  }

  ShowSnackBar(message: string, panel: string) {
    this._snackbar.open(message, "close", {
      duration: 5000,
      panelClass: [panel]
      
    });
  }

  


    get f() { return this.registerForm.controls; }


    onReset() {
      this.submitted = false;
      this.registerForm.reset();
  }


  }

  


