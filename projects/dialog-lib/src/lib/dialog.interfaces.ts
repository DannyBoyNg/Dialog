import { ComponentRef, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { Subject } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';

export interface DialogGlobalConfig {
  title?: string;
  keyboard?: boolean;
  keyboardIcons?: boolean;
  backdrop?: boolean|'static';
  autoClose?: number;
  prePopulateInput?: string;
  allowEmptyString?: boolean;
  showIcon?: boolean;
  okButtonText?: string;
  cancelButtonText?: string;
}

export interface Dialog {
  viewContainerRef?: ViewContainerRef;
  componentRef?: ComponentRef<DialogComponent>;
  responseRef?: Subject<any>;
  overlayRef?: OverlayRef;
  title?: string;
  type: DialogType;
  message: string[]|undefined;
  choices?: DialogChoice[];
  keyboard?: boolean;
  keyboardIcons?: boolean;
  backdrop?: boolean|'static';
  autoClose?: number;
  prePopulateInput?: string;
  allowEmptyString?: boolean;
  showIcon?: boolean;
  okButtonText?: string;
  cancelButtonText?: string;
}

export interface DialogChoice {
  key: number|string;
  value: string;
  autoSelect?: number;
  callback?: () => void;
}

export enum DialogType {
  Info,
  Warning,
  Error,
  Confirm,
  Choice,
  Input,
  InputMultiline,
}
