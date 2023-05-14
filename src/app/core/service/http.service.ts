import { HttpClient } from  '@angular/common/http';
import { Injectable } from  '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {
  ItemColorModel,
  ItemModel,
  ItemSizeModel,
  LoginModel,
  RegistrationModel,
} from "../../shared/models/data.models";
import {Observable} from "rxjs";
import {UserLoginResponse} from "../../shared/models/response.models";

@Injectable({
  providedIn:  'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public postRegistration(registrationModel: RegistrationModel): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.REGISTRATION, registrationModel);
  }

  public postLogin(loginModel: LoginModel): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(UrlPart.BACKEND_LINK + UrlPart.LOGIN, loginModel);
  }

  public getAllItems(): Observable<ItemModel[]> {
    return this.http.get<ItemModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEMS);
  }

  public getAllItemSizes(): Observable<ItemSizeModel[]> {
    return this.http.get<ItemSizeModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SIZES);
  }

  public getAllItemColors(): Observable<ItemColorModel[]> {
    return this.http.get<ItemColorModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_COLORS);
  }

  public getUserByVerificationToken(verificationToken: string): Observable<any> {
    return this.http.get(UrlPart.BACKEND_LINK + UrlPart.USERS, {params: {
      verificationToken: verificationToken
      }});
  }

  public postUserVerification(userId: number): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.VERIFICATION, {},{params: {
      userId: userId
      }});
  }
}
