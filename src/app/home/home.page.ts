import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  calendarOutline,
  checkmarkCircleOutline,
  checkmarkDoneCircleOutline,
  ellipsisHorizontal,
  fileTrayOutline,
  timeOutline,
  addOutline,
  playCircleOutline,
  trashOutline
} from 'ionicons/icons';
import { TaskService } from "../features/services/task-service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Status, Task } from "../features/interfaces/task";
import { DatePipe, NgClass } from "@angular/common";
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonIcon, IonLabel, IonChip, IonAvatar, IonFooter, DatePipe, NgClass, IonButton,
    IonFab, IonFabButton
  ],
})
export class HomePage implements OnInit {
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private taskService = inject(TaskService);
  tasks: WritableSignal<Task[]> = signal([]);
  private destroyRef = inject(DestroyRef);

  constructor() {
    addIcons({
      timeOutline,
      calendarOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      checkmarkDoneCircleOutline,
      ellipsisHorizontal,
      fileTrayOutline,
      addOutline,
      playCircleOutline,
      trashOutline
    });
  }

  getTasks () {
    this.taskService.getTasks()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: tasks => this.tasks.set(tasks),
        error: err => console.log(err)
      })
  }

  ionViewWillEnter() {
    this.getTasks();
  }
  ngOnInit() {
    this.getTasks();
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: CreateTaskModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.getTasks();
    }
  }

  async onDeleteTask(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer la tâche "${task.title}" ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          handler: () => {
            this.taskService.deleteTask(task.id).subscribe({
              next: () => {
                this.getTasks();
              },
              error: (err) => console.error('Erreur suppression', err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  updateStatus(task: Task, newStatus: string) {
    this.taskService.updateStatus(task.id, newStatus as Status).subscribe({
      next: (updatedTask) => {
        // Mise à jour locale de la liste
        this.getTasks()
      },
      error: (err) => console.error('Erreur mise à jour status', err)
    });
  }

  getStatusColor (status : Status): string {
    switch (status) {
      case Status.DONE: return 'success';
      case Status.IN_PROGRESS: return 'warning';
      case Status.PENDING: return 'danger';
    }
  }

  getStatusIcon (status : Status): string {
    switch (status) {
      case Status.DONE: return 'checkmark-circle-outline';
      case Status.IN_PROGRESS: return 'time-outline';
      case Status.PENDING: return 'alert-circle-outline';
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case Status.DONE: return 'Terminée';
      case Status.IN_PROGRESS: return 'En cours';
      case Status.PENDING: return 'À faire';
    }
  }
}
