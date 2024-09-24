import {Component, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  debounceTime,
  filter,
  interval,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
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

  private timestampClient = Date.now();
  private timestampServer = 0;

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

    const interval$ = interval(800);

    interval$
      .pipe(
        takeUntil(this.destroy$),
        startWith(null),
        filter(() => this.timestampClient > this.timestampServer),
        switchMap(() => this.keywordsHttp.getData$())
      )
      .subscribe(data => {
        const keys = Object.keys(data) as KeywordsDataKey[];

        keys.forEach(key => {
          const control = this.form.get(key);

          if (!control) {
            return;
          }

          if (!control.dirty) {
            control.setValue(data[key], {emitEvent: false});
          }
        });

        if (!this.form.dirty) {
          this.timestampServer = Date.now();
          this.keywords.handleChanges(data);
        }

        this.form.markAsPristine();
      });

    this.form.valueChanges
      .pipe(
        debounceTime(400),
        switchMap((data: KeywordsData) => {
          this.keywords.hideNotice();

          return this.keywordsHttp.setData$({
            ...data,
            keywords: data.keywords.trim(),
          });
        })
      )
      .subscribe(() => {
        this.timestampClient = Date.now();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
