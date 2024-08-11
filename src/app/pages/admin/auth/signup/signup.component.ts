import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../../shared/ui.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  private loadingSub!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isloading) => {
        this.isLoading = isloading;
      }
    );
    this.form = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      checkbox: new FormControl({
        validators: [false, Validators.requiredTrue],
      }),
    });
  }

  onSubmit() {
    const rawForm = this.form.getRawValue();
    this.authService
      .register(rawForm?.email, rawForm?.username, rawForm?.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/products');
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.log(this.errorMessage);
        },
      });
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
