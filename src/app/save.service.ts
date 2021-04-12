import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SaveService {

  subject = new Subject<KeyboardEvent>();

  constructor(

  ) {}

  onSave(): Observable<KeyboardEvent> {
    return this.subject.asObservable();
  }

  next(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 's') this.subject.next(event);
  }

}
