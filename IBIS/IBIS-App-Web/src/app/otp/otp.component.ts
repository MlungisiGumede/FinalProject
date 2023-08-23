import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  data: any;
  users : User[]=[];
  otp ="";
  otpForm!: FormGroup;
  constructor(private loginservice: LoginService,private fb: FormBuilder, private router: Router,private toastController: ToastController) { }

  ngOnInit(): void {

    this.otpForm = this.fb.group({

      otp : ['', Validators.required]
    })

  }

}
