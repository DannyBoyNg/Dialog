import { Component, ViewContainerRef } from '@angular/core';
import { DialogService, DialogChoice } from '../../projects/dialog/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private dialog: DialogService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.dialog.setViewContainerRef(this.viewContainerRef);
  }

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
    const response = await this.dialog.confirm('Are you sure?').toPromise<boolean>();
    console.log(response);
    // Observable
    this.dialog.confirm('Are you really sure?').subscribe((res: boolean) => console.log(res));
  }

  async input(): Promise<void> {
    // Promise
    const response = await this.dialog.input('What is your name?').toPromise<string>();
    console.log(response);
    // Observable
    this.dialog.input('What is your name again?').subscribe((res: string) => console.log(res));
  }

  async inputMultiline(): Promise<void> {
    // Promise
    const response = await this.dialog.inputMultiline('Please enter your description', null, true).toPromise<string>();
    console.log(response);
    // Observable
    this.dialog.inputMultiline('Please enter another description?', 'This is prepopulated text.', true)
    .subscribe((res: string) => console.log(res));
  }

  async choice(): Promise<void> {
    const choices: DialogChoice[] = [
      {key: 1, value: 'Choice 1'},
      {key: 2, value: 'Choice 2', callback: () => alert('Callback for choice 2 executed.')},
      {key: 3, value: 'Choice 3'}
    ];
    // Promise
    const response = await this.dialog.choice('Please make a choice', choices).toPromise<string>();
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
    const response = await this.dialog.choice('Please make a choice', choices).toPromise<string>();
    console.log(response);
  }
}
