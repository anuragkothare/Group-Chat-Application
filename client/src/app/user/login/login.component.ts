import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup,FormBuilder, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { LoginService } from '../../services//user/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email: String = ""
    password: String = ""
    submitted = false;
    returnUrl: string;

  constructor(
    
    private loginService: LoginService,
    private _route: Router
  ) { }

  ngOnInit() {
  }
  
  
  onSubmit() {
    this.submitted = true;
    this.loginService.loginUser(this.email, this.password)
        .subscribe(
            data => {
                console.log(data.data.authToken)
                localStorage.setItem('authToken', data.data.authToken)
                this._route.navigate(['/chat'])
            },
            error => {
                console.log(error)
            });
    }  
}
