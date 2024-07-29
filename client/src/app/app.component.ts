import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'charging-app';

  private serverCheckSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.serverCheckSubscription = interval(30000).subscribe(() => {
      this.authService.checkServerStatus();
    });
  }

  ngOnDestroy() {
    if (this.serverCheckSubscription) {
      this.serverCheckSubscription.unsubscribe();
    }
  }
}
