import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-status-change-badge',
  templateUrl: './status-change-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusChangeBadgeComponent {
  @Input()
  public newValue: unknown = '';

  @Input()
  public oldValue: unknown = '';
}
