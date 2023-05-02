import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {map} from "rxjs";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
  public username: string;
  public password: string;

  constructor(private httpService: HttpService, private router: Router) { }

  // login(username: string, password: string){
  //   return this.http.post(`http://localhost:8080/api/login`,
  //     { email: this.username, password: this.password },
  //     { headers:
  //         { authorization: this.createBasicAuthToken(username, password) }
  //     }).pipe(map((res) => {
  //     this.username = username;
  //     this.password = password;
  //     sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username)
  //   }));
  // }

  login(username: string, password: string){
    return this.httpService.postLogin(
      { email: username, password: password },
      ).pipe(map((res) => {
      this.username = username;
      this.password = password;
      sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username)
    }));
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    this.username = '';
    this.password = '';

  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
    return user !== null;

  }

  createBasicAuthToken(username: String, password: String) {
    return 'Basic ' + window.btoa(username + ":" + password)
  }
}
