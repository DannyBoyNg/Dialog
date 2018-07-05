import { Component, ComponentRef, HostListener, OnDestroy } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { map, take, tap, takeUntil } from 'rxjs/operators';
import { DialogChoice, DialogType, Dialog } from './dialog.interfaces';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnDestroy {

  private autoUnsubscribe = new Subject<void>();

  private componentRef: ComponentRef<DialogComponent>|undefined;
  private responseRef: Subject<any>|undefined;
  private closeDialogOnClickBackdrop: boolean|undefined;
  private dialogMessage: string|string[]|undefined;
  private keyboard = true;
  userInput: string|undefined;
  dialogTitle = '';
  messageArray: string[] = [];
  dialogType: DialogType = DialogType.Info;
  backDrop: boolean|'static'|undefined;
  dialogChoices: DialogChoice[]|undefined;
  countDown: number|undefined;
  DialogType = DialogType;

  constructor() {}

  ngOnDestroy() {
    this.autoUnsubscribe.next();
    this.autoUnsubscribe.complete();
    if (this.responseRef != null) {
      this.responseRef.complete();
      this.responseRef.unsubscribe();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyPressed(e: KeyboardEvent) {
    if (this.keyboard) {
      if (e.key === 'Escape') {
        this.closeDialog(false);
      } else if (e.key === 'Enter' && this.dialogType === DialogType.Input) {
        this.closeDialog(this.userInput);
      } else if (e.key === 'Enter') {
        this.closeDialog(true);
      }
    }
  }

  init(dialog: Dialog) {
    this.componentRef = dialog.componentRef;
    this.responseRef = dialog.responseRef;
    this.dialogMessage = dialog.message || 'no message defined';
    this.dialogTitle = dialog.title || '';
    this.dialogType = dialog.type;
    this.backDrop = dialog.backdrop;
    this.dialogChoices = (dialog.choices) ? [...dialog.choices].reverse() : [];
    this.keyboard = (dialog.keyboard != null) ? dialog.keyboard : true;
    this.closeDialogOnClickBackdrop = ((dialog.backdrop != null && dialog.backdrop !== 'static') || dialog.backdrop == null) ? true : false;
    // auto close
    if (dialog.autoClose != null) {
      const start = dialog.autoClose;
      timer(100, 1000).pipe(
        map(x => start - x),
        take(start + 1),
        tap(x => this.countDown = x),
        tap(x => { if (x === 0) {this.closeDialog(false); }}),
        takeUntil(this.autoUnsubscribe)
      ).subscribe();
    }
    this.updateDialog();
  }

  closeDialog(response?: any) {
    if (response != null && this.responseRef != null) {
      this.responseRef.next(response);
      this.responseRef.complete();
      // check if callback is defined
      const choice = this.dialogChoices && this.dialogChoices.find(x => x.key === response);
      if (choice && choice.callback && choice.callback instanceof Function) {
        choice.callback();
      }
    }
    if (this.componentRef != null) {this.componentRef.destroy(); }
  }

  updateDialog() {
    // set message to display
    if (typeof this.dialogMessage === 'string') {
      this.messageArray = [];
      this.messageArray.push(this.dialogMessage);
    } else if (this.dialogMessage instanceof Array) {
      this.messageArray = [];
      for (const item of this.dialogMessage) {
        if (typeof item === 'string') {
          this.messageArray.push(item);
        }
      }
    }
    // check for this common error
    for (const item of this.messageArray) {
      if (item === 'Http failure response for (unknown url): 0 Unknown Error') {
        this.messageArray.push('The server is not responding for unknown reasons');
      }
    }
    switch (this.dialogType) {
      case DialogType.Input:
        this.dialogTitle = this.dialogTitle || 'User input requested';
        break;
      case DialogType.Choice:
        this.dialogTitle = this.dialogTitle || 'Action required';
        break;
      case DialogType.Confirm:
        this.dialogTitle = this.dialogTitle || 'Confirm';
        break;
      case DialogType.Error:
        this.dialogTitle = this.dialogTitle || 'Error';
        break;
      case DialogType.Warning:
        this.dialogTitle = this.dialogTitle || 'Warning';
        break;
      case DialogType.Info:
      default:
        this.dialogTitle = this.dialogTitle || 'Info';
    }
  }

  clickOutsideDialog() {
    if (this.closeDialogOnClickBackdrop) { this.closeDialog(false); }
  }

  onKey(userInput: string) {
    this.userInput = userInput;
  }
}
