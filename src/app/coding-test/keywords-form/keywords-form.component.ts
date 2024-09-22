import {Component, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subject,
  switchMap,
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
  public readonly formChanges$ = new Subject<(keyof KeywordsData)[] | null>();

  public isLoading = true;

  private readonly destroy$ = new Subject<void>();

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
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((data: KeywordsData) => {
          this.form.disable({emitEvent: false});
          this.isLoading = true;
          this.keywords.hideNotice();

          return this.keywordsHttp.setData$({
            ...data,
            keywords: data.keywords.trim(),
          });
        }),
        startWith(null),
        switchMap(() => this.keywordsHttp.getData$())
      )
      .subscribe(data => {
        this.form.patchValue(data, {emitEvent: false});
        this.form.enable({emitEvent: false});
        this.isLoading = false;

        this.keywords.handleChanges(data);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
