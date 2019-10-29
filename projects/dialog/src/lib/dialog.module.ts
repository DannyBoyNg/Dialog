import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    DragDropModule,
  ],
  exports: [DialogComponent],
  entryComponents: [DialogComponent]
})
export class DialogModule { }
