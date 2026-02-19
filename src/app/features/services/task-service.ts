import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, tap} from "rxjs";
import {Status, Task} from "../interfaces/task";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`)
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'user'>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  updateStatus(id: number, status: Status): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}
