
import { Inject, Injectable, Optional, ViewContainerRef, inject, signal } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { Observable, Subject } from 'rxjs';
import { Dialog, DialogChoice, DialogGlobalConfig, DialogType } from './dialog.interfaces';
import { DIALOG_GLOBAL_CONFIG } from './dialog.tokens';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private overlay = inject(Overlay);

  private refCount = signal(0);
  private lastMessage = signal('');

  constructor(
    @Optional() @Inject(DIALOG_GLOBAL_CONFIG) private globalConfig: DialogGlobalConfig
  ) {}

  open(dialog: Dialog): Observable<any> {
    //merge global config with user supplied config
    dialog = { ...this.globalConfig, ...dialog }; 

    const responseRef = new Subject<any>();
    const currentMessage = JSON.stringify(dialog.message);
    if (this.refCount() > 0 && currentMessage === this.lastMessage()) {
      return responseRef.asObservable();
    }
    this.lastMessage.set(currentMessage);
    this.refCount.set(this.refCount() + 1);
    responseRef.subscribe({ complete: () => this.refCount.set(this.refCount() - 1) });

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true
    };
    const overlayRef = this.overlay.create(overlayConfig);
    const portal = new ComponentPortal(DialogComponent);
    const componentRef = overlayRef.attach(portal);

    dialog.componentRef = componentRef;
    dialog.responseRef = responseRef;
    dialog.overlayRef = overlayRef;
    dialog.componentRef.instance.init(dialog);
    return responseRef.asObservable();
  }

  info(message: string | string[] | object): Observable<any> {
    return this.openDialog(DialogType.Info, message);
  }

  confirm(message: string | string[] | object): Observable<any> {
    return this.openDialog(DialogType.Confirm, message);
  }

  input(message: string | string[] | object, prePopulateInput?: string, allowEmptyString?: boolean): Observable<any> {
    return this.openDialog(DialogType.Input, message, prePopulateInput, allowEmptyString);
  }

  inputMultiline(message: string | string[] | object, prePopulateInput?: string, allowEmptyString?: boolean ): Observable<any> {
    return this.openDialog(DialogType.InputMultiline, message, prePopulateInput, allowEmptyString, 'static');
  }

  warning(message: string | string[] | object): Observable<any> {
    return this.openDialog(DialogType.Warning, message);
  }

  error(message: string | string[] | object): Observable<any> {
    return this.openDialog(DialogType.Error, message);
  }

  choice(message: string | string[] | object, choices: DialogChoice[]): Observable<any> {
    return this.open({
    message: this.prepMessage(message),
    type: DialogType.Choice,
    choices
    });
  }

  private openDialog(
    type: DialogType,
    message: string | string[] | object,
    prePopulateInput: string | null = null,
    allowEmptyString: boolean|undefined = true,
    backdrop?: boolean|'static'
    ): Observable<any> 
  {
    const dialog: Dialog = {
      message: this.prepMessage(message),
      type,
      allowEmptyString,
      backdrop,
      prePopulateInput: prePopulateInput ?? undefined
    };
    return this.open(dialog);
  }

  private prepMessage(input: string | string[] | object): string[] {
    if (typeof input === 'string') return [input];
    if (Array.isArray(input)) return input.filter(item => typeof item === 'string');
    if (typeof input === 'object') {
      return Object.entries(input).flatMap(([key, value]) => [`${key}: ${this.prepMessage(value).join(' ')}`]);
    }
    return [''];
  }
}
