import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import 'zone.js';
import { Subscription, tap } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { LabelComponent } from './label.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelComponent],
  template: `

    <div class="container">
      <div class="col-md-6 offset-md-3">
    <h2 class="my-3 text-center">Dynamic Form Validation</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-light p-3 rounded" >
      <div class="mb-3">
        <app-label for="firstName" [control]="form.controls.firstName">First Name</app-label>
        <input id="firstName" type="text" class="form-control" formControlName="firstName">
      </div>

      <div class="mb-3">
        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" formControlName="lastName">
      </div>

      <div class="mb-3">
        <app-label for="yearOfBirth"  [control]="form.controls.yearOfBirth" >Year of Birth</app-label>
        <select class="form-select"  formControlName="yearOfBirth">
              <option [ngValue]="null">Select  Date</option>
              <option [value]="year" *ngFor="let year of years">{{year}} </option>
        </select>
      </div>

      <div class="mb-3">
        <app-label class="form-label" [control]="form.controls.passport">Paasport 
      
      </app-label>
        <input class="form-control" type="text" formControlName="passport">

        <ng-container *ngIf="form.controls.passport as passport">
          <small class="text-danger" *ngIf="passport.dirty && passport.hasError('pattern')">
            Allowed valid format
          </small>

          <small class="text-danger" *ngIf="passport.dirty && passport.hasError('required')">
            Required
          </small>

        </ng-container>


      </div>


      

      <div class="d-grid gap-2">
  <button class="btn btn-primary" [disabled]="form.invalid" type="submit">Save</button>
</div>
    </form>

</div>
</div>
    
  `,
})
export class App implements OnInit, OnDestroy {
  name = 'Angular';
  fb = inject(FormBuilder);

  years: number[] = [];
  sub = new Subscription();
  form = this.fb.group({
    firstName: ['Aamir', [Validators.required, Validators.minLength(4)]],
    lastName: ['Khan', [Validators.required, Validators.minLength(2)]],
    yearOfBirth: [1992, [Validators.required]],
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
  });

  // yearOfBirth: this.fb.nonNullable.control(1992, [Validators.required]),

  setupYear() {
    const currentYear = new Date().getFullYear();
    for (let i = 1992; i <= currentYear; i++) {
      this.years.push(i);
    }
  }

  ngOnInit() {
    this.setupYear();
    //issue in the below code
    //this.setUpValidation();
    this.setUpBetterSolution();
  }

  /**this solution enable the submit button, Even we form is invalid. It only change the status of form when we change the year of birth */
  // setUpValidation() {
  //   this.form.controls.yearOfBirth.valueChanges.subscribe((yearOfBirth) => {
  //     this.isAdult(yearOfBirth)
  //       ? this.form.controls.passport.addValidators(Validators.required)
  //       : this.form.controls.passport.removeValidators(Validators.required);

  //     this.form.controls.passport.updateValueAndValidity();
  //     this.form.controls.passport.markAsDirty();
  //   });
  // }

  dynamicValidtor = Validators.minLength(2);

  setUpBetterSolution() {
    this.sub = this.form.controls.yearOfBirth.valueChanges
      .pipe(
        tap(() => this.form.controls.passport.markAsDirty()),
        startWith(this.form.controls.yearOfBirth.value)
      )
      .subscribe((yearOfBirth) => {
        this.isAdult(yearOfBirth)
          ? this.form.controls.passport.addValidators(Validators.required)
          : this.form.controls.passport.removeValidators(Validators.required);

        this.form.controls.passport.updateValueAndValidity();
        // this.form.controls.passport.markAsDirty();
      });
    //Those validator that takes arguments create diffreent refs. Eg: minLength
    // we need to take extra propery to remove this property
    //this.form.controls.firstName.addValidators(this.dynamicValidtor);
    //this.form.controls.firstName.removeValidators(this.dynamicValidtor);
  }

  private isAdult(yearOfBirth: number | null): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - Number(yearOfBirth) >= 18;
  }

  onSubmit() {
    console.log(this.form.value);
    alert(1);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

bootstrapApplication(App);
