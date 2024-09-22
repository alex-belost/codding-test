import {FormControl} from '@angular/forms';

export enum Separator {
  space = 'space',
  coma = 'coma',
  backslash = 'backslash',
}

export enum KeywordsDataKey {
  keywords = 'keywords',
  separator = 'separator',
  reset = 'reset',
}

export interface KeywordsData {
  [KeywordsDataKey.keywords]: string;
  [KeywordsDataKey.separator]: Separator | null;
  [KeywordsDataKey.reset]: boolean;
}

export interface KeywordsDataForm {
  [KeywordsDataKey.keywords]: FormControl<string>;
  [KeywordsDataKey.separator]: FormControl<Separator | null>;
  [KeywordsDataKey.reset]: FormControl<boolean>;
}

export interface RadioButtonOption<T = string> {
  value: T;
  label: string;
}

export type BufferKeywordsData = KeywordsData[];
