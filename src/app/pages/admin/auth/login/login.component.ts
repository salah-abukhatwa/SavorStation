import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { UiService } from '../../../../shared/ui.service';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  private loadingSub!: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isloading) => {
        this.isLoading = isloading;
      }
    );
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const rawForm = this.loginForm.getRawValue();
    this.authService.login(rawForm?.email, rawForm?.password).subscribe({
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
