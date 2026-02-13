import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-logout-button',
  template: `
    <ion-button (click)="logout()">
      <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
    </ion-button>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon]
})
export class LogoutButtonComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ logOutOutline });
  }

  async logout() {
    await this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
