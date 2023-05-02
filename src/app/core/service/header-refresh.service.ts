import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderRefreshService {
  private subject = new Subject<any>();

  sendUpdate() {
    this.subject.next('');
  }

  getUpdate(): Observable<any> {
    return this.subject.asObservable();
  }
}
