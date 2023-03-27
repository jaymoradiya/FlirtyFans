import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-btn',
  templateUrl: './theme-btn.component.html',
  styleUrls: ['./theme-btn.component.css'],
})
export class ThemeBtnComponent {
  @Input()
  value = '';

  @Input()
  type = 'button';
}
