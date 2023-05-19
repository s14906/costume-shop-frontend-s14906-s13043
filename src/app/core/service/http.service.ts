import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {
  ItemColorModel,
  ItemModel,
  ItemSizeModel
} from "../../shared/models/data.models";
import {Observable} from "rxjs";
import {
  AddAddressRequest,
  AddToCartRequest,
  LoginRequest,
  LoginResponse,
  RegistrationRequest
} from "../../shared/models/rest.models";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //TODO: observable types

  constructor(private http: HttpClient) {
  }

  public postRegistration(registrationRequest: RegistrationRequest): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.REGISTRATION, registrationRequest);
  }

  public postLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(UrlPart.BACKEND_LINK + UrlPart.LOGIN, loginRequest);
  }

  public postAddAddress(addAddressRequest: AddAddressRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(UrlPart.BACKEND_LINK + UrlPart.ADD_ADDRESS, addAddressRequest);
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
    return this.http.get(UrlPart.BACKEND_LINK + UrlPart.USERS, {
      params: {
        verificationToken: verificationToken
      }
    });
  }

  public getAddressesForUser(userId: number): Observable<any> {
    return this.http.get(UrlPart.BACKEND_LINK + UrlPart.GET_ADDRESSES, {
      params: {
        userId: userId
      }
    });
  }

  public postUserVerification(userId: number): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.VERIFICATION, {}, {
      params: {
        userId: userId
      }
    });
  }

  public postAddToCart(addToCartRequest: AddToCartRequest): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.CART, addToCartRequest);
  }

  public getCartItemsByUserId(userId: number): Observable<any> {
    return this.http.get(UrlPart.BACKEND_LINK + UrlPart.CART, {
      params: {
        userId: userId
      }
    })
  }

  postRemoveAddress(addressId: number): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.REMOVE_ADDRESS, {}, {
      params: {
        addressId: addressId
      }
    });
  }

  postChangePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post(UrlPart.BACKEND_LINK + UrlPart.CHANGE_PASSWORD, {}, {
      params: {
        userId: userId,
        newPassword: newPassword
      }
    });
  }

}
