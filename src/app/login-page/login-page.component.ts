import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartServiceService } from '../services/cart-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{

  userLoginForm!: FormGroup
  formData!:FormData

  constructor(private formBuilder:FormBuilder, private service:CartServiceService, private route: Router) {}

  ngOnInit(): void {
      this.userLoginForm = this.formBuilder.group({
        email:[''],
        password:['']
      })
  }

  onSubmit(){
    this.formData = this.userLoginForm.value
    this.service.userLogin(this.formData).subscribe((value:any)=>{
      if(value.loginStatus == 'success') {
        const strValue = JSON.stringify(value)
        sessionStorage.setItem('userValue', strValue)
        console.log('User token stored in sessionStorage:', strValue);
        this.route.navigate(['/products'])
      }
    })
  }
}
