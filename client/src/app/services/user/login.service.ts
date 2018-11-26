import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../../Models/User';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public _http: HttpClient) { }

  public baseUrl = "http://localhost:3000/api/v1/users";


  // Register Service
  registerUser(userModel: User) {
    return this._http.post(this.baseUrl + '/signup', userModel);
  }

  // Login Service
  loginUser(email: String, password: String) {
    return this._http.post<any>(this.baseUrl + '/login', { email: email, password: password})
  }

}
