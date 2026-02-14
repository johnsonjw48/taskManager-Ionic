import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, 
  IonItem, IonInput, IonTextarea, IonIcon, ModalController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { TaskService } from '../../features/services/task-service';
import { Task } from '../../features/interfaces/task';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, 
    IonItem, IonInput, IonTextarea, IonIcon
  ]
})
export class CreateTaskModalComponent {
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private taskService = inject(TaskService);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  isSubmitting = false;

  constructor() {
    addIcons({ closeOutline, saveOutline });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      const taskData = this.taskForm.value;
      
      this.taskService.createTask(taskData).subscribe({
        next: (newTask: Task) => {
          this.isSubmitting = false;
          // On ferme la modale en renvoyant la nouvelle tâche crée
          this.modalCtrl.dismiss(newTask, 'confirm');
        },
        error: (err: any) => {
          console.error('Erreur création tâche', err);
          this.isSubmitting = false;
          // Ici on pourrait afficher un Toast d'erreur
        }
      });
    }
  }
}
