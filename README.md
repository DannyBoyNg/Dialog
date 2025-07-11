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

Version 20.0 is Angular 20 compliant and has some cosmetic improvements.

Always set the ViewContainerRef before using this library or the dialogs will not work.
```typescript
//app.component.ts
constructor(
    private dialog: DialogService,
    private viewContainerRef: ViewContainerRef,
) {
    this.dialog.setViewContainerRef(this.viewContainerRef);
}
```
Available dialog settings
```typescript
// available dialog settings
const dialog: Dialog = {
  message: ['For your information'], // every string in array will be on a newline.
  type: DialogType.Info, // set a dialog type; info, warning, error, confirm, input, multilineInput and choice.
  backdrop: false, // true: show a backdrop (default), false: don't show a backdrop, 'static': show backdrop but click on backdrop won't close dialog.
  autoClose: 10, // automatically close/cancel dialog in 10 seconds.
  keyboard: false, // true: Enter and Escape will close dialog (default), false: keyboard has no effect.
  title: 'my custom dialog title', // use a custom dialog title.
  showIcon: false, // true: show the dialog icons (default), false: don't show dialog icons.
  okButtonText: 'Sure'; // use custom ok button text.
  cancelButtonText: 'Nope'; // use custom cancel button text.
  prePopulateInput: 'This is pre populated input text'; // You can set a pre defined text for input dialogs.
  allowEmptyString: false; // true: the input dialog will allow you to submit an empty string (default), false: empty string is not allowed
};
```
How to set global settings
```typescript
//app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideDialogConfig({keyboard: false, showIcon: false}) // <--- add this provider to your app.config.ts to configure global dialog settings
  ]
};
```
How to use
```typescript
info() {
  this.dialog.info('For your information');
}

warning() {
  this.dialog.warning('Warning');
}

error() {
  this.dialog.error('Error');
}

async custom() {
  //promise
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
  });
  console.log(response);
  //observable
  this.dialog.open({
    message: ['This is a custom dialog message.','Second line of the message.'],
    type: DialogType.Confirm,
    title: 'Custom Dialog Title',
    showIcon: false,
    autoClose: 15,
    backdrop: 'static',
    keyboard: false,
    okButtonText: 'Sure',
    cancelButtonText: 'Nope',
  }).subscribe((response: string) => console.log(response));;
}
```

Version 2.0 breaking changes

From version 2.0 onward, you don't need to use viewContainerRef for every dialog window to create a dialog box. You just have to add viewContainerRef to the dialogService once, in app.component.ts. Version 2.0 is not backwards compatible with 1.x
  
```typescript
//app.component.ts
constructor(
    private dialog: DialogService,
    private viewContainerRef: ViewContainerRef,
) {
    this.dialog.setViewContainerRef(this.viewContainerRef);
}
```
Now you can open a dialog box without viewContainerRef
```typescript
this.dialog.info('For your information');
```

Version 1.x
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
