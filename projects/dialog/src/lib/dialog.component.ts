import { Component, ComponentRef, HostListener, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { map, take, tap, takeUntil } from 'rxjs/operators';
import { DialogChoice, DialogType, Dialog } from './dialog.interfaces';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnDestroy, AfterViewInit {

  private autoUnsubscribe = new Subject<void>();

  private dialog: Dialog|undefined;
  private componentRef: ComponentRef<DialogComponent>|undefined;
  private responseRef: Subject<any>|undefined;
  private closeDialogOnClickBackdrop: boolean|undefined;
  private dialogMessage: string[]|undefined;
  private keyboard = true;
  userInput: string|undefined;
  dialogTitle = '';
  messageArray: string[] = [];
  dialogType: DialogType = DialogType.Info;
  backDrop: boolean|'static'|undefined;
  dialogChoices: DialogChoice[]|undefined;
  countDown: number|undefined;
  autoSelectTimer: number|undefined;
  allowEmptyString: boolean|undefined;
  DialogType = DialogType;

  @ViewChild('inputBox') inputBox: ElementRef|undefined;

  constructor(
    private ref: ChangeDetectorRef,
  ) {}

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
        this.closeDialog(false);
        e.stopPropagation();
        e.preventDefault();
      } else if ((e.key === 'Enter' && this.dialogType === DialogType.Input)
             || (e.ctrlKey === true && e.key === 'Enter' && this.dialogType === DialogType.InputMultiline))
      {
        if (this.userInput != null && this.userInput?.trim().length !== 0) {
          this.closeDialog(this.userInput);
          e.stopPropagation();
          e.preventDefault();
        }
      } else if (e.key === 'Enter' && this.dialogType === DialogType.InputMultiline) {
        // do nothing
      } else if (e.key === 'Enter') {
        this.closeDialog(true);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keypress', ['$event'])
  @HostListener('window:keyup', ['$event'])
  doNotCascade(e: KeyboardEvent): void {
    if (e.key === 'Enter' && this.dialogType === DialogType.InputMultiline) {
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
    this.dialogChoices = (dialog.choices) ? [...dialog.choices].reverse() : [];
    this.keyboard = (dialog.keyboard != null) ? dialog.keyboard : true;
    this.closeDialogOnClickBackdrop = ((dialog.backdrop != null && dialog.backdrop !== 'static') || dialog.backdrop == null) ? true : false;
    this.allowEmptyString = dialog.allowEmptyString ?? false;
    if (dialog.prePopulateInput) {this.userInput = dialog.prePopulateInput; }
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
    // auto select
    for (const item of this.dialogChoices) {
      if (item.autoSelect != null && !isNaN(+item.autoSelect)) {
        const start = item.autoSelect;
        if (start == null) {break; }
        timer(100, 1000).pipe(
          map(x => start - x),
          take(start + 1),
          tap(x => this.autoSelectTimer = x),
          tap(x => { if (x === 0) {this.closeDialog(item.key); }}),
          takeUntil(this.autoUnsubscribe)
        ).subscribe();
        break;
      }
    }
    this.updateDialog();
    this.ref.markForCheck();
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
