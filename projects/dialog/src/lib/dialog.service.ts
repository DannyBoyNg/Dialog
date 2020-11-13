import { Injectable, ViewContainerRef, Inject, ComponentFactoryResolver } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Dialog, DialogType, DialogChoice } from './dialog.interfaces';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private rootViewContainerRef: ViewContainerRef|undefined;
  private refCount = 0;
  private lastMessage = '';

  constructor(
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  setViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.rootViewContainerRef = viewContainerRef;
  }

  open(dialog: Dialog): Observable<any> {
    const responseRef = new Subject<any>();
    // don't open a new dialog if there is already a dialog opened with the same message
    const currentMessage = JSON.stringify(dialog.message);
    if (this.refCount > 0 && currentMessage === this.lastMessage) {return responseRef.asObservable(); }
    this.lastMessage = currentMessage;
    this.refCount++;
    responseRef.subscribe({complete: () => this.refCount--});
    // create the a new dialog
    const factory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    if (dialog.viewContainerRef == null) {dialog.viewContainerRef = this.rootViewContainerRef; }
    if (dialog.viewContainerRef == null) {
      console.error(
`Missing ViewContainerRef. Please set the viewContainerRef in the dialog service in app.component.ts
----------------------------------------------------------------------------------------------------
constructor(
  private dialog: DialogService,
  private viewContainerRef: ViewContainerRef,
) {
  this.dialog.setViewContainerRef(this.viewContainerRef);
}`);
      throw Error('ViewContainerRef not found');
    }
    dialog.componentRef = dialog.viewContainerRef.createComponent(factory);
    dialog.responseRef = responseRef;
    dialog.componentRef.instance.init(dialog);
    return responseRef.asObservable();
  }

  info(message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Info
    };
    return this.open(dialog);
  }

  confirm(message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Confirm
    };
    return this.open(dialog);
  }

  input(message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Input
    };
    return this.open(dialog);
  }

  warning(message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Warning
    };
    return this.open(dialog);
  }

  error(message: string|string[]|object): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Error
    };
    return this.open(dialog);
  }

  choice(message: string|string[]|object, choices: DialogChoice[]): Observable<any> {
    const dialog: Dialog = {
      viewContainerRef: this.rootViewContainerRef,
      message: this.prepMessage(message),
      type: DialogType.Choice,
      choices,
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
        messageArray.push(`${key}: ${this.prepMessage(value).join(' ')}`);
      }
      return messageArray;
    } else {
      return [''];
    }
  }
}
