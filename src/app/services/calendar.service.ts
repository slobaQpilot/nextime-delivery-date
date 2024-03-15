import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  public monthChanged: EventEmitter<{ year: number; month: number }> =
    new EventEmitter();

  constructor() {}
}
