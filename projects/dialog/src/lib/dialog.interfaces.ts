import { ComponentRef, ViewContainerRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { Subject } from 'rxjs';

export interface Dialog {
    viewContainerRef: ViewContainerRef;
    componentRef?: ComponentRef<DialogComponent>;
    responseRef?: Subject<any>;
    Title?: string;
    Type: DialogType;
    Message: string | string[] | undefined;
    Choices?: DialogChoice[];
    Keyboard?: boolean;
    Backdrop?: boolean | 'static';
    AutoClose?: number;
}

export interface DialogChoice {
    Key: number|string;
    Value: string;
    Callback?: () => void;
}

export enum DialogType {
    Info,
    Warning,
    Error,
    Confirm,
    Choice,
    Input
}
