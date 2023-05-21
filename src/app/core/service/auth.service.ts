import { Injectable } from '@angular/core';
import {map, Observable, ReplaySubject} from "rxjs";
import {HttpService} from "./http.service";
import {TokenStorageService} from "./token-storage.service";
import {UserResponse} from "../../shared/models/rest.models";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  USER_NAME_SESSION_ATTRIBUTE_NAME: string = 'authenticatedUser';

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private httpService: HttpService,
              private tokenStorageService: TokenStorageService) { }

  login(username: string, password: string): Observable<UserResponse>{
    return this.httpService.postLogin(
      { email: username, password: password }
      ).pipe(map((response: UserResponse) => {
      sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username)
      this.loggedIn.next(true);
      this.tokenStorageService.userRoleSubject.next(response.user.roles);
      return response;
    }));
  }

  announceLogout(): void {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.loggedIn.next(false);
  }

  getIsLoggedIn(): Observable<boolean> {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user !== null) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }
}
