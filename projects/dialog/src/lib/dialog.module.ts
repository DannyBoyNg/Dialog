import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [
    DialogComponent
  ]
})
export class DialogModule { }
