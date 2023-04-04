import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input()
  label = '';
  @Input()
  maxDate?: Date;
  bsConfig: Partial<BsDatepickerConfig>;

  get control() {
    return this.ngControl.control as FormControl;
  }

  constructor(@Self() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.maxDate = new Date('01/01/2005');
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY',
    };
  }
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
