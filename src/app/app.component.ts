import { Component, ViewContainerRef } from '@angular/core';
import { DialogService } from 'projects/dialog/src/public_api';
import { DialogChoice } from 'projects/dialog/src/lib/dialog.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private dialog: DialogService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  info() {
    this.dialog.info(this.viewContainerRef, 'For your information');
  }

  warning() {
    this.dialog.warning(this.viewContainerRef, 'Warning');
  }

  error() {
    this.dialog.error(this.viewContainerRef, 'Error');
  }

  async confirm() {
    // Promise
    const response = await this.dialog.confirm(this.viewContainerRef, 'Are you sure?').toPromise<boolean>();
    console.log(response);
    // Observable
    this.dialog.confirm(this.viewContainerRef, 'Are you really sure?').subscribe((res: boolean) => console.log(res));
  }

  async input() {
    // Promise
    const response = await this.dialog.input(this.viewContainerRef, 'What is your name?').toPromise<string>();
    console.log(response);
    // Observable
    this.dialog.input(this.viewContainerRef, 'What is your name again?').subscribe((res: string) => console.log(res));
  }

  async choice() {
    const choices: DialogChoice[] = [
      {key: 1, value: 'Choice 1'},
      {key: 2, value: 'Choice 2', callback: () => alert('Callback for choice 2 executed.')},
      {key: 3, value: 'Choice 3'}
    ];
    // Promise
    const response = await this.dialog.choice(this.viewContainerRef, 'Please make a choice', choices).toPromise<string>();
    console.log(response);
    // Observable
    this.dialog.choice(this.viewContainerRef, 'Please make a choice again', choices).subscribe((res: string) => console.log(res));
  }

  async choice2() {
    const choices: DialogChoice[] = [
      {key: 1, value: 'Choice 1'},
      {key: 2, value: 'Choice 2', autoSelect: 10},
      {key: 3, value: 'Choice 3'}
    ];
    // Promise
    const response = await this.dialog.choice(this.viewContainerRef, 'Please make a choice', choices).toPromise<string>();
    console.log(response);
  }
}
