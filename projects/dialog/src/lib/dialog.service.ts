import { Injectable, ViewContainerRef, Inject, ComponentFactoryResolver } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Dialog, DialogType, DialogChoice } from './dialog.interfaces';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private refCount = 0;
  private lastMessage = '';

  constructor(
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  open(dialog: Dialog) {
    const responseRef = new Subject<any>();
    // don't open a new dialog if there is already a dialog opened with the same message
    const currentMessage = JSON.stringify(dialog.message);
    if (this.refCount > 0 && currentMessage === this.lastMessage) {return responseRef.asObservable(); }
    this.lastMessage = currentMessage;
    this.refCount++;
    responseRef.subscribe({complete: () => this.refCount--});
    // create the a new dialog
    const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    dialog.componentRef = dialog.viewContainerRef.createComponent(factory);
    dialog.responseRef = responseRef;
    dialog.componentRef.instance.init(dialog);
    return responseRef.asObservable();
  }

  info(viewContainerRef: ViewContainerRef, message: string|string[]|object) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Info
    };
    return this.open(dialog);
  }

  confirm(viewContainerRef: ViewContainerRef, message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Confirm
    };
    return this.open(dialog);
  }

  input(viewContainerRef: ViewContainerRef, message: string|string[]|object) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Input
    };
    return this.open(dialog);
  }

  warning(viewContainerRef: ViewContainerRef, message: string|string[]|object) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Warning
    };
    return this.open(dialog);
  }

  error(viewContainerRef: ViewContainerRef, message: string|string[]|object) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Error
    };
    return this.open(dialog);
  }

  choice(viewContainerRef: ViewContainerRef, message: string|string[]|object, choices: DialogChoice[]) {
    const dialog: Dialog = {
      viewContainerRef: viewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Choice,
      choices: choices,
    };
    return this.open(dialog);
  }

  private prepMessage(unknown: string|string[]|object): string[] {
    const messageArray = [];
    if (typeof unknown === 'string') {
      messageArray.push(unknown);
      return messageArray;
    } else if (unknown instanceof Array) {
      for (const part of unknown) {
        if (typeof part === 'string') {
          messageArray.push(part);
        }
      }
      return messageArray;
    } else if (typeof unknown === 'object') {
      for (const [key, value] of Object.entries(unknown)) {
        messageArray.push([`${key}: ${this.prepMessage(value).join(' ')}`]);
      }
      return messageArray;
    } else {
      return [''];
    }
  }
}
