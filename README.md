# Dialog

An Angular library to display dialog windows to the user

## Dependancies

none

## Installing

Install from NPM

```bash
npm install @dannyboyng/dialog
```

## Usage

Basic

```typescript
constructor(
  private dialog: DialogService,
  private viewContainerRef: ViewContainerRef, // get viewContainerRef from Dependancy Injection
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
    {key: 2, value: 'Choice 2', Callback: () => alert('Callback for choice 2 executed.')},
    {key: 3, value: 'Choice 3'}
  ];
  // Promise
  const response = await this.dialog.choice(this.viewContainerRef, 'Please make a choice', choices).toPromise<string>();
  console.log(response);
  // Observable
  this.dialog.choice(this.viewContainerRef, 'Please make a choice', choices).subscribe((res: string) => console.log(res));
}
```

Advanced

```typescript
const dialog: Dialog = {
  viewContainerRef: this.viewContainerRef,
  message: 'For your information',
  type: DialogType.Info,
  backdrop: false, // true: show a backdrop (default), false: don't show a backdrop, 'static': show backdrop but click on backdrop won't close dialog
  autoClose: 10, // automatically close/cancel dialog in 10 seconds
  keyboard: false, // true: Enter and Escape will close dialog (default), false: keyboard has no effect
  title: 'my custom dialog title'
};
this.dialog.open(dialog);

const choices: DialogChoice[] = [
  {key: 1, value: 'Choice 1'},
  {key: 2, value: 'Choice 2', autoSelect: 10}, // automatically select choice2 in 10 seconds if no user interaction
  // only use autoSelect on one choice otherwise you may experience undefined behavior
  {key: 3, value: 'Choice 3'}
];
const dialog: Dialog = {
  viewContainerRef: this.viewContainerRef,
  message: 'Pick a choice',
  type: DialogType.Choice,
  choices: choices,
  backdrop: 'static',
  autoClose: 10,
  keyboard: false,
  title: 'my custom dialog title'
};
this.dialog.open(dialog);
```

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome.
