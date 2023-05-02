import { HttpClient } from  '@angular/common/http';
import { Injectable } from  '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {LoginModel, RegistrationModel} from "../../shared/models/data.models";
import {Observable} from "rxjs";

@Injectable({
  providedIn:  'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public postRegistration(registrationModel: RegistrationModel): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.REGISTRATION, registrationModel);
  }

  public postLogin(loginModel: LoginModel): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.LOGIN, loginModel);
  }

}
