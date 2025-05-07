import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private subject: Subject<any> = new Subject<any>();
  subjectObservable$!: Observable<any>;

  constructor() {
    this.subjectObservable$ = this.subject.asObservable();
  }

  emit(event: any) {
    this.subject.next(event);
  }
}
