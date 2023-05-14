import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
  public userRoleSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

    constructor() { }

    signOut(): void {
        window.sessionStorage.clear();
    }

    public saveToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    // @ts-ignore
    public saveUser(user): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): any {
        const userKey = sessionStorage.getItem(USER_KEY);
        if(userKey)
        return JSON.parse(userKey);
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
