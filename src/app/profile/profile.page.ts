import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, 
  IonItem, IonLabel, IonList, IonListHeader, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline, settingsOutline, fingerPrintOutline } from 'ionicons/icons';
import { AuthService } from '../core/auth/services/auth-service';
import { Router } from '@angular/router';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

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
    addIcons({ personCircleOutline, logOutOutline, settingsOutline, fingerPrintOutline });
  }

  async testBiometric() {
    if (!Capacitor.isNativePlatform()) {
      alert('La biométrie n\'est gérée que sur application mobile (iOS/Android).');
      return;
    }

    try {
      const result = await NativeBiometric.isAvailable();
      
      if (!result.isAvailable) {
        alert('Biométrie non disponible sur cet appareil.');
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: "Pour valider que c'est bien vous",
        title: "Vérification de sécurité",
        subtitle: "Accès aux paramètres sensibles",
      });

      alert('Succès ! Empreinte validée.');
    } catch (error) {
      console.error(error);
      alert('Échec de la vérification biométrique.');
    }
  }

  async logout() {
    await this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
