import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';
import {KEYWORDS_MOCK, NOTIFICATION_DISPLAYING_DELAY} from '../app.constants';
import {
  BufferKeywordsData,
  KeywordsData,
  KeywordsDataForm,
  KeywordsDataKey,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class KeywordsService {
  private _bufferForm: BufferKeywordsData = [];
  private noticeTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly formChanges$ = new BehaviorSubject<KeywordsDataKey[] | null>(
    null
  );

  public readonly isKeywordsChanged$!: Observable<KeywordsDataKey.keywords | null>;
  public readonly isSeparatorChanged$!: Observable<KeywordsDataKey.separator | null>;

  public get bufferForm(): BufferKeywordsData {
    return this._bufferForm;
  }

  public constructor(private readonly formBuilder: FormBuilder) {
    this.isKeywordsChanged$ = this.getKeyChange$<KeywordsDataKey.keywords>(
      KeywordsDataKey.keywords
    );

    this.isSeparatorChanged$ = this.getKeyChange$<KeywordsDataKey.separator>(
      KeywordsDataKey.separator
    );
  }

  public hideNotice(): void {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
      this.noticeTimeout = null;
    }

    if (!this.formChanges$.value) {
      return;
    }

    this.formChanges$.next(null);
  }

  public handleChanges(data: KeywordsData): void {
    this.setBuffer(data);

    if (this._bufferForm.length < 2) {
      return;
    }

    const [oldData, newData] = this._bufferForm;
    const keys = Object.keys(oldData) as (keyof KeywordsData)[];

    const changes = keys.filter(key => {
      const oldValue = oldData[key];
      const newValue = newData[key];

      return oldValue !== newValue;
    });

    this.hideNotice();

    this.formChanges$.next(changes.length ? changes : null);

    this.noticeTimeout = setTimeout(
      () => this.hideNotice(),
      NOTIFICATION_DISPLAYING_DELAY
    );
  }

  public getForm(): FormGroup<KeywordsDataForm> {
    return this.formBuilder.group({
      [KeywordsDataKey.keywords]: [''],
      [KeywordsDataKey.separator]: [null],
      [KeywordsDataKey.reset]: [false],
    }) as FormGroup<KeywordsDataForm>;
  }

  public getState(data: Partial<KeywordsData> = {}): KeywordsData {
    const initialState = {
      [KeywordsDataKey.keywords]: KEYWORDS_MOCK,
      [KeywordsDataKey.separator]: null,
      [KeywordsDataKey.reset]: false,
    };

    return {
      ...initialState,
      ...data,
    };
  }

  private setBuffer(data: KeywordsData) {
    this._bufferForm = this._bufferForm.length
      ? [this._bufferForm.at(-1) as KeywordsData, data]
      : [data];
  }

  private getKeyChange$<T extends KeywordsDataKey>(
    key: T
  ): Observable<T | null> {
    return this.formChanges$.pipe(
      map(changes => {
        const hasKey = changes && changes.includes(key);

        return hasKey ? key : null;
      })
    );
  }
}
