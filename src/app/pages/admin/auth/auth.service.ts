import { inject, Injectable, signal } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  setPersistence,
  browserSessionPersistence,
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

  // Set expiration time (e.g., 1 day in milliseconds)
  private expirationTime = 5 * 60 * 60 * 1000; // 1 day

  initializeAuthState(): Promise<void> {
    return new Promise((resolve) => {
      this.checkAuthStatus();
      resolve();
    });
  }

  private checkAuthStatus(): void {
    if (typeof localStorage !== 'undefined') {
      const authTime = JSON.parse(localStorage.getItem('authTime') || '0');
      const currentTime = new Date().getTime();

      // Check if the session has expired
      if (currentTime - authTime > this.expirationTime) {
        this.logout(); // If expired, log the user out
      } else {
        // If not expired, update auth status based on localStorage
        this.isAuthenticated = !!localStorage.getItem('isAuthenticated');
        if (this.isAuthenticated) {
          this.authChange.next(true);
        }
      }
    }
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    this.uiService.loadingStateChanged.next(true);
    const promise = createUserWithEmailAndPassword(this.fbAuth, email, password)
      .then((res) => {
        updateProfile(res.user, { displayName: username });
        this.setAuthStatus(true);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.showSnackbar(error.message, null, 500);
        this.uiService.loadingStateChanged.next(false);
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    this.uiService.loadingStateChanged.next(true);
    const promise = signInWithEmailAndPassword(this.fbAuth, email, password)
      .then(() => {
        this.setAuthStatus(true);
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.showSnackbar(error.message, null, 500);
        this.uiService.loadingStateChanged.next(false);
      });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.fbAuth).then(() => {
      this.setAuthStatus(false);
    });
    return from(promise);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  // Update auth status with expiration logic
  private setAuthStatus(status: boolean): void {
    this.isAuthenticated = status;
    const currentTime = new Date().getTime();

    if (typeof localStorage !== 'undefined') {
      if (status) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTime', JSON.stringify(currentTime)); // Store the current time for session expiration
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
      }
    }
    this.authChange.next(status);
  }
}
