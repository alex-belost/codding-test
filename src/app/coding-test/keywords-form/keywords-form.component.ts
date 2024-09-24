import {Component, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  concatMap,
  debounceTime,
  filter,
  Observable,
  retry,
  startWith,
  Subject,
  switchMap,
  takeLast,
  takeUntil,
  tap,
} from 'rxjs';
import {SEPARATOR_OPTIONS} from '../../app.constants';
import {KeywordsHttpService} from '../../services/keywords-http.service';
import {KeywordsService} from '../../services/keywords.service';
import {
  BufferKeywordsData,
  KeywordsData,
  KeywordsDataKey,
  RadioButtonOption,
} from '../../types';

@Component({
  selector: 'app-keywords-form',
  templateUrl: './keywords-form.component.html',
})
export class KeywordsDataComponent implements OnDestroy {
  public readonly separatorOptions: RadioButtonOption[] = SEPARATOR_OPTIONS;

  public readonly form!: FormGroup;

  private readonly destroy$ = new Subject<void>();
  private readonly dataQueue$ = new Subject<KeywordsData>();

  private isUserEditing = false;

  public get bufferForm(): BufferKeywordsData {
    return this.keywords.bufferForm;
  }

  public get isKeywordsChanged$(): Observable<KeywordsDataKey.keywords | null> {
    return this.keywords.isKeywordsChanged$;
  }

  public get isSeparatorChanged$(): Observable<KeywordsDataKey.separator | null> {
    return this.keywords.isSeparatorChanged$;
  }

  public constructor(
    private readonly keywordsHttp: KeywordsHttpService,
    private readonly keywords: KeywordsService
  ) {
    this.form = this.keywords.getForm();

    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        tap(() => (this.isUserEditing = true)),
        debounceTime(600),
        tap(() => (this.isUserEditing = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(data => this.dataQueue$.next(data));

    this.dataQueue$
      .pipe(
        retry(2),
        filter(() => !this.isUserEditing),
        concatMap(data =>
          this.keywordsHttp.setData$(data).pipe(
            switchMap(() => this.keywordsHttp.getData$()),
            takeLast(1)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (!this.isUserEditing) {
          this.form.patchValue(data, {emitEvent: false});
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
