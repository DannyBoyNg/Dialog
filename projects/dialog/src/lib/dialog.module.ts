import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [DialogComponent]
})
export class DialogModule { }
