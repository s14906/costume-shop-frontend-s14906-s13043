import {Injectable} from "@angular/core";
import {Observable, ReplaySubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private subject: Subject<any> = new ReplaySubject(1);

  emitNextValue(subject: Subject<any>, nextValue: any) {
    this.subject = subject;
    if (nextValue) {
      this.subject.next(nextValue);
    }
  }

  getSubjectAsObservable(): Observable<any> {
    return this.subject.asObservable();
  }
}
