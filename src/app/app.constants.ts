import {RadioButtonOption, Separator} from './types/keywords';

export const NOTIFICATION_DISPLAYING_DELAY = 3e3;

export const KEYWORDS_MOCK = 'name age area';

export const DEFAULT_SEPARATOR = Separator.space;

export const SEPARATOR_OPTIONS: RadioButtonOption<Separator>[] = [
  {value: Separator.coma, label: 'Coma'},
  {value: Separator.backslash, label: 'Backslash'},
];

export const SEPARATOR_MAP: Record<Separator, string> = {
  [Separator.backslash]: '/',
  [Separator.coma]: ',',
  [Separator.space]: ' ',
};
