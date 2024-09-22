import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {KeywordsData} from '../types/keywords';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class KeywordsHttpService {
  public constructor(
    private readonly http: HttpClient,
    private readonly toast: ToastService
  ) {}

  public getData$(): Observable<KeywordsData> {
    return this.http.get<KeywordsData>('/api/v1/keywords').pipe(
      catchError(err => {
        this.toast.message(err);
        return of(null) as Observable<never>;
      })
    );
  }

  public setData$(data: KeywordsData): Observable<unknown> {
    return this.http.post('/api/v1/update_keywords', data).pipe(
      catchError(err => {
        this.toast.message(err);
        return of(null) as Observable<never>;
      })
    );
  }
}
