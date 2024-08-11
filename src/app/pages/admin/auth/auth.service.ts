import { inject, Injectable, signal } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { User } from './user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiService } from '../../../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(
    private uiService: UiService,
    private fbAuth: Auth,
    private snackBar: MatSnackBar
  ) {}

  user$ = user(this.fbAuth);
  currentUserSig = signal<User | null | undefined>(undefined);

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    this.uiService.loadingStateChanged.next(true);
    const promise = createUserWithEmailAndPassword(this.fbAuth, email, password)
      .then((res) => {
        updateProfile(res.user, { displayName: username });
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        let errorMessage = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage =
            'This email address is already in use. Please try another one.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage =
            'The email address is invalid. Please enter a valid email.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage =
            'Email/password accounts are not enabled. Please contact support.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage =
            'The password is too weak. Please enter a stronger password.';
        }

        this.uiService.showSnackbar(errorMessage, null, 5000);
        this.uiService.loadingStateChanged.next(false);
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    this.uiService.loadingStateChanged.next(true);
    const promise = signInWithEmailAndPassword(this.fbAuth, email, password)
      .then(() => {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        let errorMessage = 'An unknown error occurred.';
        if (error.code === 'auth/wrong-password') {
          errorMessage = 'The password is incorrect. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No user found with this email address.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage =
            'The email address is invalid. Please enter a valid email.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage =
            'Too many unsuccessful login attempts. Please try again later.';
        }

        this.uiService.showSnackbar(errorMessage, null, 5000);
        this.uiService.loadingStateChanged.next(false);
      });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.fbAuth).then(() => {
      this.isAuthenticated = false;
      this.authChange.next(false);
    });
    return from(promise);
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
