import { Injectable } from '@angular/core';
import {map, Observable, ReplaySubject} from "rxjs";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  USER_NAME_SESSION_ATTRIBUTE_NAME: string = 'authenticatedUser';

  public loggedIn: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private httpService: HttpService) { }

  login(username: string, password: string): Observable<any>{
    return this.httpService.postLogin(
      { email: username, password: password },
      ).pipe(map((res) => {
      sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username)
      this.loggedIn.next(res.success);
      return res;
    }));
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.loggedIn.next(false);
  }

  getIsLoggedIn(): Observable<boolean> {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    if (user !== null) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }
}
