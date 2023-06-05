import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public userRoleSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

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
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const userKey = localStorage.getItem(USER_KEY);
    if (userKey)
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
