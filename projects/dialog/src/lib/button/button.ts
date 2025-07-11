import { Component, effect, HostListener, input, InputSignal, signal } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ConditionalFocus } from '../conditional-focus';

@Component({
  selector: 'app-button',
  imports: [ConditionalFocus],
  templateUrl: './button.html',
  styleUrl: './button.css',
  animations: [
    trigger('hoverState', [
      state('normal', style({})),
      state('hovered',
        style({
          backgroundColor: '#E5F1FB',
          borderColor: '#0078D7',
        })),
      transition('* => *', [animate('0.2s')]),
    ]),
  ],
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


