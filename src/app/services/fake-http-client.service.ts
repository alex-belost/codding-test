import {catchError, delay, map, Observable, of, tap, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {DEFAULT_SEPARATOR, SEPARATOR_MAP} from '../app.constants';
import {KeywordsData, KeywordsDataKey} from '../types';
import {KeywordsService} from './keywords.service';

@Injectable({
  providedIn: 'root',
})
export class FakeHttpClientService {
  private readonly STORAGE_KEY = 'keywordsForm';
  private readonly GET_URL = '/api/v1/keywords';
  private readonly POST_URL = '/api/v1/update_keywords';

  public constructor(private readonly keywords: KeywordsService) {}

  public get<T extends object>(url: string): Observable<T> {
    if (url !== this.GET_URL) {
      return this.simulateHttpError(404, 'Invalid URL: ' + url);
    }

    return of(localStorage.getItem(this.STORAGE_KEY)).pipe(
      delay(500),
      map((rawData: string | null) =>
        rawData ? JSON.parse(rawData) : this.keywords.getState()
      ),
      catchError(() => this.simulateHttpError(500, 'Failed to fetch data'))
    );
  }

  public post<T extends KeywordsData>(url: string, data: T): Observable<void> {
    if (url !== this.POST_URL) {
      return this.simulateHttpError(404, 'Invalid URL: ' + url);
    }

    return of(undefined).pipe(
      delay(500),
      tap(() => {
        if (this.shouldFailRequest()) {
          throw new Error('Simulated server error');
        }

        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify(this.handleData(data))
        );
      }),
      catchError(() => this.simulateHttpError(500, 'Failed to save data'))
    );
  }

  private simulateHttpError(
    statusCode: number,
    message: string
  ): Observable<never> {
    return throwError(() => new Error(`${statusCode}: ${message} (Fake)`));
  }

  private shouldFailRequest(): boolean {
    return Math.random() < 0.3;
  }

  private handleData(data: KeywordsData): KeywordsData {
    const separator = data[KeywordsDataKey.separator];
    const canReset = data[KeywordsDataKey.reset];

    const divider =
      separator && !canReset
        ? SEPARATOR_MAP[separator]
        : SEPARATOR_MAP[DEFAULT_SEPARATOR];

    const keywords = data.keywords.replace(/[,/ ]+/g, divider);

    return this.keywords.getState({
      keywords,
      separator: !canReset ? separator : null,
    });
  }
}
