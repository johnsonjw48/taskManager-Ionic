import { Component, inject, signal, computed, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { layersOutline, checkmarkDoneOutline, timeOutline } from 'ionicons/icons';
import { TaskService } from '../features/services/task-service';
import { Task, Status } from '../features/interfaces/task';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonIcon
  ]
})
export class DashboardPage {
  private taskService = inject(TaskService);

  // Signal principal contenant toutes les tâches
  tasks: WritableSignal<Task[]> = signal([]);

  // Signaux calculés (KPIs)
  totalTasks = computed(() => this.tasks().length);

  doneTasks = computed(() =>
    this.tasks().filter(t => t.status === Status.DONE).length
  );

  inProgressTasks = computed(() =>
    this.tasks().filter(t => t.status === Status.IN_PROGRESS).length
  );

  completionRate = computed(() => {
    const total = this.totalTasks();
    const done = this.doneTasks();
    return total > 0 ? (done / total) * 100 : 0;
  });

  constructor() {
    addIcons({ layersOutline, checkmarkDoneOutline, timeOutline });
  }

  ionViewWillEnter() {
    this.loadStats();
  }

  private loadStats() {
    this.taskService.getTasks().pipe(take(1)).subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => console.error('Erreur chargement dashboard', err)
    });
  }
}
