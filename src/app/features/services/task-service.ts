import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, tap, switchMap, map } from "rxjs";
import { Task, Status } from "../interfaces/task";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  #tasks: WritableSignal<Task[]> = signal([]);
  public readonly tasks: Signal<Task[]> = this.#tasks.asReadonly();

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`).pipe(
      tap(tasks => this.#tasks.set(tasks))
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'user'>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task).pipe(
      switchMap(newTask => this.getTasks().pipe(map(() => newTask)))
    );
  }

  updateStatus(id: number, status: Status): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, { status }).pipe(
      switchMap(updatedTask => this.getTasks().pipe(map(() => updatedTask)))
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`).pipe(
      switchMap(() => this.getTasks().pipe(map(() => void 0)))
    );
  }
}
