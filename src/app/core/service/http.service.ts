import { HttpClient } from  '@angular/common/http';
import { Injectable } from  '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {ItemColorModel, ItemModel, ItemSizeModel, LoginModel, RegistrationModel} from "../../shared/models/data.models";
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

  public getAllItems(): Observable<ItemModel[]> {
    return this.http.get<ItemModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEMS);
  }

  public getAllItemSizes(): Observable<ItemSizeModel[]> {
    return this.http.get<ItemSizeModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SIZES);
  }

  public getAllItemColors(): Observable<ItemColorModel[]> {
    return this.http.get<ItemColorModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_COLORS);
  }
}
