import { Directive, ElementRef, inject, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[libConditionalFocus]'
})
export class ConditionalFocus {

  el = inject(ElementRef);

  libConditionalFocus: InputSignal<boolean|undefined> = input();

  constructor() { }
  
  ngAfterViewInit() {
    if (this.libConditionalFocus()) {
      this.el.nativeElement.focus();
    }
  }

}
