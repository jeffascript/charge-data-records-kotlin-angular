import { Component, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn = computed(() => {
    return !!this.authState.user();
  });

  username = computed(() => {
    return this.authState.user()?.username || '';
  });

  isServerAlive = computed(() => this.authState.isServerAlive());
  constructor(
    private router: Router,
    private authService: AuthService,
    public authState: AuthState
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
