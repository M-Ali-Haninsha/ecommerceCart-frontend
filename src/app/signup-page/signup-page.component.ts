import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartServiceService } from '../services/cart-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit{

  userSignupForm!: FormGroup
  formData!: FormData

  constructor(private formBuilder: FormBuilder, private service:CartServiceService, private route:Router) {}

  ngOnInit(): void {
      this.userSignupForm = this.formBuilder.group({
        userName:['', Validators.required],
        email:['', Validators.required],
        password:['', Validators.required]
      })
  }

  onSubmit() {
    if(this.userSignupForm.valid) {
      this.formData = this.userSignupForm.value
    console.log(this.formData);
    this.service.userSignup(this.formData).subscribe((value:any)=> {
      if(value.success == 'created') {  
        this.route.navigate(['/products'])
       }
    })
    }
  }
}
