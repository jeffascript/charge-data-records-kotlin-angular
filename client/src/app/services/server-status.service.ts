import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService {
  constructor(private httpService: HttpService) {}

  checkServerStatus() {
    return this.httpService.get('/auth/alive').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
