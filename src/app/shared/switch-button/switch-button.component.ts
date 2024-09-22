import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchButtonComponent),
      multi: true,
    },
  ],
})
export class SwitchButtonComponent implements ControlValueAccessor {
  @Input()
  public name = '';

  public isChecked = false;
  public isDisabled = false;

  private onChange!: (value: boolean) => void;
  private onTouched!: () => void;

  public onInputChange(): void {
    if (!this.isDisabled) {
      this.isChecked = !this.isChecked;
      this.onChange(this.isChecked);
      this.onTouched();
    }
  }

  public writeValue(value: boolean): void {
    this.isChecked = value;
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
