import {Component, DestroyRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonBackButton,
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../core/auth/services/auth-service";
import {addIcons} from "ionicons";
import {lockClosedOutline, mailOutline, personOutline} from "ionicons/icons";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonBackButton,
    RouterLink
  ]
})
export class LoginPage  {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
        next: (userToken) => {
          this.router.navigate(['/tabs/tasks'])
        }
      })
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }
}
