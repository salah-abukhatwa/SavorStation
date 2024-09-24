import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  Firestore,
  FirestoreModule,
  collectionData,
} from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './pages/admin/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FirestoreModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SavorStation';
  isLoading = true;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.initializeAuthState().then(() => {
      this.isLoading = false;
    });
  }
}
