import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DialogService, DialogChoice, DialogType } from '../../../../projects/dialog-lib/src/public-api';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private dialog = inject(DialogService);
  protected readonly title = signal('dialog-app');

  info(): void {
    this.dialog.info('For your information');
  }

  warning(): void {
    this.dialog.warning('Warning');
  }

  error(): void {
    this.dialog.error('Error');
  }

  async confirm(): Promise<void> {
    // Promise
    const response = await firstValueFrom(this.dialog.confirm('Are you sure?'));
    console.log(response);
    // Observable
    this.dialog.confirm('Are you really sure?').subscribe((res: boolean) => console.log(res));
  }

  async input(): Promise<void> {
    // Promise
    const response = await firstValueFrom(this.dialog.input('What is your name?'));
    console.log(response);
    // Observable
    this.dialog.input('What is your name again?').subscribe((res: string) => console.log(res));
  }

  async inputMultiline(): Promise<void> {
    // Promise
    const response = await firstValueFrom(this.dialog.inputMultiline('Please enter your description', undefined, true));
    console.log(response);
    // Observable
    this.dialog.inputMultiline('Please enter another description?', 'This is prepopulated text.', true)
    .subscribe((res: string) => console.log(res));
  }

  async choice(): Promise<void> {
    const choices: DialogChoice[] = [
      {key: 1, value: 'Choice 1'},
      {key: 2, value: 'Choice 2', callback: () => alert('Callback for choice 2 executed.')},
      {key: 3, value: 'Choice 3'},
      {key: 4, value: 'Choice 4'},
      {key: 5, value: 'Choice 5'},
      {key: 6, value: 'Choice 6'},
      {key: 7, value: 'Choice 7'},
    ];
    // Promise
    const response = await firstValueFrom(this.dialog.choice('Please make a choice', choices));
    console.log(response);
    // Observable
    this.dialog.choice('Please make a choice again', choices).subscribe((res: string) => console.log(res));
  }

  async choice2(): Promise<void> {
    const choices: DialogChoice[] = [
      {key: 1, value: 'Choice 1'},
      {key: 2, value: 'Choice 2', autoSelect: 10},
      {key: 3, value: 'Choice 3'}
    ];
    // Promise
    const response = await firstValueFrom(this.dialog.choice('Please make a choice', choices));
    console.log(response);
  }

  async custom() {
    const response = await firstValueFrom(this.dialog.open({
      message: ['This is a custom dialog message.','Second line of the message.'],
      type: DialogType.Confirm,
      title: 'Custom Dialog Title',
      showIcon: false,
      autoClose: 15,
      backdrop: 'static',
      keyboard: false,
      okButtonText: 'Sure',
      cancelButtonText: 'Nope',
    }));
    console.log(response);
  }
}
