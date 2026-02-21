import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonNote, IonChip, IonIcon, IonLabel, IonAvatar, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircleOutline, checkmarkCircleOutline, alertCircleOutline, timeOutline, checkmarkDoneCircleOutline } from 'ionicons/icons';
import { TaskService } from '../../features/services/task-service';
import { Task, Status } from '../../features/interfaces/task';
import { TaskStatusPipe } from '../../shared/pipes/task-status.pipe';
import { TaskColorPipe } from '../../shared/pipes/task-color.pipe';
import { TaskIconPipe } from '../../shared/pipes/task-icon.pipe';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DatePipe, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonNote, IonChip, IonIcon, IonLabel, IonAvatar, IonButton, IonSpinner,
    TaskStatusPipe, TaskColorPipe, TaskIconPipe
  ]
})
export class TaskDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  task: WritableSignal<Task | null> = signal(null);

  constructor() {
    addIcons({ playCircleOutline, checkmarkCircleOutline, alertCircleOutline, timeOutline, checkmarkDoneCircleOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(+id);
    }
  }

  loadTask(id: number) {
    this.taskService.getTaskById(id).subscribe({
      next: (t) => this.task.set(t),
      error: (err) => console.error('Erreur chargement tâche', err)
    });
  }

  updateStatus(newStatus: string) {
    const currentTask = this.task();
    if (!currentTask) return;

    this.taskService.updateStatus(currentTask.id, newStatus as Status).subscribe({
      next: (updatedTask) => {
        this.task.set(updatedTask);
      },
      error: (err) => console.error('Erreur mise à jour status', err)
    });
  }
}
