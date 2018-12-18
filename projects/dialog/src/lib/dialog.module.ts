import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule
  ],
  exports: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
