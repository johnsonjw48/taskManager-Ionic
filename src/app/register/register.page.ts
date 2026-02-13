import {Component, DestroyRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import {AuthService} from "../core/auth/services/auth-service";
import {User} from "../core/auth/interfaces/user";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class RegisterPage  {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef)

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }



  onRegister() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
        next: (user:User) => {
          this.router.navigate(['/home'])
        },
      });
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
    }
  }
}
