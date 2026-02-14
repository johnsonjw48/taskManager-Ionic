import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, barChartOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        
        <!-- Onglet Tâches -->
        <ion-tab-button tab="tasks" href="/tabs/tasks">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Tâches</ion-label>
        </ion-tab-button>

        <!-- Onglet Dashboard -->
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon name="bar-chart-outline"></ion-icon>
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <!-- Onglet Profil -->
        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Vous</ion-label>
        </ion-tab-button>
        
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --border: 0;
      box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
    }
  `],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage {
  constructor() {
    addIcons({ listOutline, barChartOutline, personOutline });
  }
}
