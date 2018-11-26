import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { User } from '../../Models/User';
import { LoginService } from '../../services/user/login.service';
import { Router } from '@angular/router';

import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})  
export class RegisterComponent implements OnInit {

  constructor(public _service: LoginService, public _router: Router) { }

  user: User = new User("", "", "", "", null, "");
  errorMessage: String

  ngOnInit() {
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  onSubmit() {
    this._service.registerUser(this.user).subscribe(
      (data: any) => {
        console.log(data);
        this._router.navigate(['/login'])

      },
      error => {
        console.log(error)
        this.errorMessage = error.error.errorMessage;}
    )
  }


  

}


