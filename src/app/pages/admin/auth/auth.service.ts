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
  ) {
    this.checkAuthStatus();
  }

  user$ = user(this.fbAuth);
  currentUserSig = signal<User | null | undefined>(undefined);

  private checkAuthStatus(): void {
    if (typeof localStorage !== 'undefined') {
      this.isAuthenticated = !!localStorage.getItem('isAuthenticated');
      if (this.isAuthenticated) {
        this.authChange.next(true);
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

  private setAuthStatus(status: boolean): void {
    this.isAuthenticated = status;
    if (typeof localStorage !== 'undefined') {
      if (status) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.removeItem('isAuthenticated');
      }
    }
    this.authChange.next(status);
  }
}
