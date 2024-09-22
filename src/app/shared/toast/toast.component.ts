import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Input,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input()
  public message = '';

  @HostBinding('style.opacity')
  public opacity = '0';

  public constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.opacity = '1';
    });

    setTimeout(() => this.close(), 3000);
  }

  close(): void {
    this.opacity = '0';

    setTimeout(() => {
      if (this.el.nativeElement.parentNode) {
        this.renderer.removeChild(
          this.el.nativeElement.parentNode,
          this.el.nativeElement
        );
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.el.nativeElement.parentNode) {
      this.renderer.removeChild(
        this.el.nativeElement.parentNode,
        this.el.nativeElement
      );
    }
  }
}
