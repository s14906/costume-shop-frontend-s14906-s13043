import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {OrderDetailsDTO} from "../../shared/models/dto.models";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ORDER_DETAILS_KEY = 'order-details';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public userRoleSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private userToken: string;

  constructor() {
  }

  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    this.userToken = user.token;
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public saveOrderDetails(order: OrderDetailsDTO): void {
    localStorage.removeItem(ORDER_DETAILS_KEY + this.userToken);
    localStorage.setItem(ORDER_DETAILS_KEY + this.userToken, JSON.stringify(order));
  }

  public getUser(): any {
    const userKey = localStorage.getItem(USER_KEY);
    if (userKey)
      return JSON.parse(userKey);
  }

  public getOrderDetails(): any {
    const order = localStorage.getItem(ORDER_DETAILS_KEY + this.userToken);
    if (order)
      return JSON.parse(order);
  }

  public getUserRoles(): Observable<string[]> {
    const userKey = this.getUser();
    if (userKey) {
      this.userRoleSubject.next(userKey.roles);
    } else {
      this.userRoleSubject.next([]);
    }
    return this.userRoleSubject.asObservable();
  }

}
