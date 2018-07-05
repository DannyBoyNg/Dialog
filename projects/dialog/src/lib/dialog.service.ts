import { Injectable, ViewContainerRef, Inject, ComponentFactoryResolver } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Dialog, DialogType, DialogChoice } from './dialog.interfaces';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  open(dialog: Dialog) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    dialog.componentRef = dialog.viewContainerRef.createComponent(factory);
    const responseRef = new Subject<any>();
    dialog.responseRef = responseRef;
    dialog.componentRef.instance.init(dialog);
    return responseRef.asObservable();
  }

  info(viewContainerRef: ViewContainerRef, message: string) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Info
    };
    return this.open(dialog);
  }

  confirm(viewContainerRef: ViewContainerRef, message: string): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Confirm
    };
    return this.open(dialog);
  }

  input(viewContainerRef: ViewContainerRef, message: string) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Input
    };
    return this.open(dialog);
  }

  warning(viewContainerRef: ViewContainerRef, message: string|string[]) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Warning
    };
    return this.open(dialog);
  }

  error(viewContainerRef: ViewContainerRef, message: string|string[]) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Error
    };
    return this.open(dialog);
  }

  choice(viewContainerRef: ViewContainerRef, message: string|string[], choices: DialogChoice[]) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: message,
      type: DialogType.Choice,
      choices: choices,
    };
    return this.open(dialog);
  }
}
