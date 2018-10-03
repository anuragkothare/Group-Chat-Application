import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from '../../User/User';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public _http: HttpClient) { }

  public baseUrl = "http://localhost:3000/api/v1/users";

  registerUser(userModel: User) {
    return this._http.post(this.baseUrl + '/signup', userModel);
  }

}
