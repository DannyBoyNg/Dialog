import { Component, ComponentRef, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewInit, WritableSignal, signal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Subject, timer } from 'rxjs';
import { map, take, tap, takeUntil } from 'rxjs/operators';
import { DialogChoice, DialogType, Dialog } from './dialog.interfaces';
import { Button } from './button/button';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  imports: [DragDropModule, Button, A11yModule],
})
export class DialogComponent implements OnDestroy, AfterViewInit {

  private autoUnsubscribe = new Subject<void>();

  private dialog: Dialog|undefined;
  private componentRef: ComponentRef<DialogComponent>|undefined;
  private responseRef: Subject<any>|undefined;
  private closeDialogOnClickBackdrop: boolean|undefined;
  private dialogMessage: string[]|undefined;
  keyboard = true;
  userInput: string = '';
  dialogTitle = '';
  messageArray: string[] = [];
  dialogType: DialogType = DialogType.Info;
  backDrop: boolean|'static'|undefined;
  dialogChoices: DialogChoice[]|undefined;
  countDown: WritableSignal<number|undefined> = signal(undefined);
  autoSelectTimer: WritableSignal<number|undefined> = signal(undefined);
  allowEmptyString: boolean|undefined;
  showIcon: boolean|undefined;
  DialogType = DialogType;
  selectedButtonStates: WritableSignal<boolean[]> = signal([]);
  okButtonText: string|undefined;
  cancelButtonText: string|undefined;

  @ViewChild('inputBox') inputBox: ElementRef|undefined;

  ngAfterViewInit(): void {
    if (this.inputBox != null && this.dialog?.prePopulateInput != null) {
      this.inputBox.nativeElement.value = this.dialog.prePopulateInput;
    }
  }

  ngOnDestroy(): void {
    this.autoUnsubscribe.next();
    this.autoUnsubscribe.complete();
    if (this.responseRef != null) {
      this.responseRef.complete();
      this.responseRef.unsubscribe();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyPressed(e: KeyboardEvent): void {
    if (this.keyboard) {
      if (e.key === 'Escape') {
        this.selectedButtonStates.update(x => {x[0] = true; return [...x];});
        setTimeout(() => this.closeDialog(false),500);
        e.stopPropagation();
        e.preventDefault();
      } else if ((e.key === 'Enter' && this.dialogType === DialogType.Input) || (e.ctrlKey === true && e.key === 'Enter' && this.dialogType === DialogType.InputMultiline)) {
        if (!(this.userInput == null || (this.userInput != null && this.userInput.trim() === '' && this.allowEmptyString === false))) {
          this.selectedButtonStates.update(x => {x[1] = true; return [...x];});
          setTimeout(() => this.closeDialog(this.userInput),500);
          e.stopPropagation();
          e.preventDefault();
        }
      } else if (e.key === 'Enter' && (this.dialogType === DialogType.InputMultiline || this.dialogType === DialogType.Choice)) {
        // do nothing
      } else if (e.key === 'Enter') {
        this.selectedButtonStates.update(x => {x[1] = true; return [...x];});
        setTimeout(() => this.closeDialog(true),500);
        e.stopPropagation();
        e.preventDefault();
      } else if (this.dialogType === DialogType.Choice && (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5' || e.key === '6' || e.key === '7' || e.key === '8' || e.key === '9')) {
        const key = +e.key + 1;
        this.selectedButtonStates.update(x => {x[key] = true; return [...x];});
        setTimeout(() => this.closeDialog(this.dialogChoices![key - 2].key),500);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keypress', ['$event'])
  @HostListener('window:keyup', ['$event'])
  doNotCascade(e: KeyboardEvent): void {
    if (e.key === 'Enter' && (this.dialogType === DialogType.InputMultiline || this.dialogType === DialogType.Choice)) {
      // do nothing
    } else if (e.key === 'Escape' || e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  init(dialog: Dialog): void {
    this.dialog = dialog;
    this.componentRef = dialog.componentRef;
    this.responseRef = dialog.responseRef;
    this.dialogMessage = dialog.message || ['no message defined'];
    this.dialogTitle = dialog.title || '';
    this.dialogType = dialog.type;
    this.backDrop = dialog.backdrop;
    this.dialogChoices = (dialog.choices) ? [...dialog.choices] : [];
    this.keyboard = (dialog.keyboard != null) ? dialog.keyboard : true;
    this.closeDialogOnClickBackdrop = ((dialog.backdrop != null && dialog.backdrop !== 'static') || dialog.backdrop == null) ? true : false;
    this.allowEmptyString = dialog.allowEmptyString ?? true;
    this.showIcon = dialog.showIcon ?? true;
    this.okButtonText = dialog.okButtonText || 'OK';
    this.cancelButtonText = dialog.cancelButtonText || 'Cancel';
    if (dialog.prePopulateInput) {this.userInput = dialog.prePopulateInput; }
    // auto close
    if (dialog.autoClose != null) {
      const start = dialog.autoClose;
      timer(100, 1000).pipe(
        map(x => start - x),
        take(start + 1),
        tap(x => this.countDown.set(x)),
        tap(x => { if (x === 0) {
          if (this.dialogType === DialogType.Info || this.dialogType === DialogType.Warning || this.dialogType === DialogType.Error) {
            this.selectedButtonStates.update(x => {x[1] = true; return [...x];});
          } else {
            this.selectedButtonStates.update(x => {x[0] = true; return [...x];});
          }
          setTimeout(() => this.closeDialog(false),1000);
        }}),
        takeUntil(this.autoUnsubscribe)
      ).subscribe();
    }
    // auto select
    for (const [index, item] of this.dialogChoices.entries()) {
      if (item.autoSelect != null && !isNaN(+item.autoSelect)) {
        const start = item.autoSelect;
        if (start == null) {break; }
        timer(100, 1000).pipe(
          map(x => start - x),
          take(start + 1),
          tap(x => this.autoSelectTimer.set(x)),
          tap(x => { if (x === 0) {
            this.selectedButtonStates.update(x => {x[index+2] = true; return [...x];});
            setTimeout(() => this.closeDialog(item.key),1000);
          }}),
          takeUntil(this.autoUnsubscribe)
        ).subscribe();
        break;
      }
    }
    this.updateDialog();
  }

  closeDialog(response?: any): void {
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

  updateDialog(): void {
    // set message to display
    this.messageArray = this.dialogMessage ?? [];
    // check for this common error
    for (const item of this.messageArray) {
      if (item === 'Http failure response for (unknown url): 0 Unknown Error') {
        this.messageArray.push('The server is not responding for unknown reasons');
      }
    }
    switch (this.dialogType) {
      case DialogType.InputMultiline:
        this.dialogTitle = this.dialogTitle || 'Input field';
        break;
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

  clickOutsideDialog(): void {
    if (this.closeDialogOnClickBackdrop) { this.closeDialog(false); }
  }

  onKey(userInput: string): void {
    this.userInput = userInput;
  }
}
