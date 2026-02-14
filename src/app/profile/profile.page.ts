import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, 
  IonItem, IonLabel, IonList, IonListHeader, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { AuthService } from '../core/auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, 
    IonItem, IonLabel, IonList, IonListHeader, IonIcon, IonButton
  ]
})
export class ProfilePage {
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ personCircleOutline, logOutOutline, settingsOutline });
  }

  async logout() {
    await this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
