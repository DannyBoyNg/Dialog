import { Component, effect, HostListener, input, InputSignal, signal } from '@angular/core';
import { ConditionalFocus } from '../conditional-focus';

@Component({
  selector: 'app-button',
  imports: [ConditionalFocus],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {

  disabled = input(false);
  isHovered = signal(false);
  isFocused: InputSignal<boolean|undefined> = input();
  isSelected: InputSignal<boolean|undefined> = input();
  visualizeSelectionEffect = effect(() => this.isSelected() ? this.isHovered.set(true) : this.isHovered.set(false));

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.disabled()) this.isHovered.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.disabled()) this.isHovered.set(false);
  }
}


