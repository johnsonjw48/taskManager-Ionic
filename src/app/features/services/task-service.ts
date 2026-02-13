import {inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, tap} from "rxjs";
import {Task} from "../interfaces/task";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`)
  }
}
