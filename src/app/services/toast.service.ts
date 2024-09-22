import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  EmbeddedViewRef,
} from '@angular/core';
import {ToastComponent} from '../shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  message(message: string) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ToastComponent);

    const componentRef = componentFactory.create(this.injector);
    componentRef.instance.message = message;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }, 3500);
  }
}
