import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-label',
  standalone: true,
  template: `
  <label class="form-label" [for]="for">
    <ng-content></ng-content>
    <span *ngIf="required" class="text-danger"> *</span>
  </label>`,

  imports: [ReactiveFormsModule, CommonModule],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class LabelComponent {
  @Input() for?: string;
  @Input() control!: AbstractControl;

  get required(): boolean {
    console.log(this.control);
    return this.control.hasValidator(Validators.required);
  }
}
