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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FirestoreModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SavorStation';
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // This will trigger the authChange Subject if the user is already authenticated
    if (this.auth.isAuth()) {
      this.auth.authChange.next(true);
    }
  }
}
