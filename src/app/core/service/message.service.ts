import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new Subject<any>();

  sendUpdate(message: string) {
    this.subject.next({ text: message });
  }

  getUpdate(): Observable<any> {
    return this.subject.asObservable();
  }
}
