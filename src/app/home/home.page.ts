import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { TaskStatusPipe } from '../shared/pipes/task-status.pipe';
import {TaskColorPipe} from "../shared/pipes/task-color.pipe";
import {TaskIconPipe} from "../shared/pipes/task-icon.pipe";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonIcon, IonLabel, IonChip, IonAvatar, IonFooter, DatePipe, NgClass, IonButton,
    IonFab, IonFabButton, TaskStatusPipe, TaskColorPipe, TaskIconPipe
  ],
})
export class HomePage implements OnInit {
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  public taskService = inject(TaskService); // Public pour l'utiliser dans le HTML
  private router = inject(Router);

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

  // Navigation personnalisée pour éviter les conflits avec les boutons internes
  goToDetail(id: number, event: Event) {
    const target = event.target as HTMLElement;

    // Si l'élément cliqué (ou un de ses parents) est un bouton, on annule la navigation
    if (target.closest('ion-button')) {
      return;
    }

    this.router.navigate(['/task-detail', id]);
  }


  tasks = this.taskService.tasks;

  loadTasks() {
    this.taskService.getTasks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      error: err => console.log('Erreur chargement liste', err)
    });
  }

  ionViewWillEnter() {
    this.loadTasks();
  }

  ngOnInit() {
    this.loadTasks(); // Initialisation garantie
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: CreateTaskModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // Plus besoin d'appeler getTasks() ici !
    // Le service a déjà mis à jour la liste via createTask(data).
  }

  async onDeleteTask(task: Task, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer la tâche "${task.title}" ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'confirm',
          handler: () => {
            // Le service gère la suppression ET la mise à jour locale
            this.taskService.deleteTask(task.id).subscribe({
              error: (err) => console.error('Erreur suppression', err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  updateStatus(task: Task, newStatus: string, event: Event) {
    event.stopPropagation();
    // Le service gère la mise à jour API ET la mise à jour locale (optimistic)
    this.taskService.updateStatus(task.id, newStatus as Status).subscribe({
      error: (err) => console.error('Erreur mise à jour status', err)
    });
  }
}
