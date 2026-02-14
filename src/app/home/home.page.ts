import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons,
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
  ModalController
} from '@ionic/angular/standalone';
import {LogoutButtonComponent} from '../core/components/logout-button/logout-button.component';
import {addIcons} from 'ionicons';
import {
  alertCircleOutline,
  calendarOutline,
  checkmarkCircleOutline,
  ellipsisHorizontal,
  fileTrayOutline,
  timeOutline,
  addOutline
} from 'ionicons/icons';
import {TaskService} from "../features/services/task-service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Status, Task} from "../features/interfaces/task";
import {DatePipe} from "@angular/common";
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, LogoutButtonComponent,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonIcon, IonLabel, IonChip, IonAvatar, IonFooter, DatePipe, IonButton,
    IonFab, IonFabButton
  ],
})
export class HomePage implements OnInit {
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ timeOutline, calendarOutline, alertCircleOutline, checkmarkCircleOutline, ellipsisHorizontal, fileTrayOutline, addOutline });
  }

  private taskService = inject(TaskService);
  tasks:WritableSignal<Task[]> = signal([]);
  private destroyRef = inject(DestroyRef);

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
      this.getTasks()
    }
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

  // private refresh$ = new BehaviorSubject<void>(undefined);
  // tasks = toSignal(
  //   this.refresh$.pipe(switchMap(() => this.taskService.getTasks())),
  //   {initialValue: [] as Task[]}
  // )
  //
  // ionViewWillEnter() {
  //   this.refresh$.next();
  // }
}
