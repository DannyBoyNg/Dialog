import { ComponentRef, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { Subject } from 'rxjs';

export interface Dialog {
    viewContainerRef: ViewContainerRef;
    componentRef?: ComponentRef<DialogComponent>;
    responseRef?: Subject<any>;
    title?: string;
    type: DialogType;
    message: string | string[] | undefined;
    choices?: DialogChoice[];
    keyboard?: boolean;
    backdrop?: boolean | 'static';
    autoClose?: number;
}

export interface DialogChoice {
    key: number|string;
    value: string;
    callback?: () => void;
}

export enum DialogType {
    Info,
    Warning,
    Error,
    Confirm,
    Choice,
    Input
}
