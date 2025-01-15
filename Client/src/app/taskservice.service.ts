import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Category {
  _id: string;
  title: string;
  user_id: string;
}

interface Task {
  _id: string;
  title: string;
  desc: string;
  time: string;
  status: 'todo' | 'done';
  category: string;
}

interface NewTask {
  title: string;
  desc: string;
  time: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'http://localhost:4000/tasks';
  private categoriesUrl = 'http://localhost:4000/categories';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addTask(task: NewTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() });
  }
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task._id}`, task, { headers: this.getHeaders() });
  }
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, { headers: this.getHeaders() });
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl, { headers: this.getHeaders() });
  }

  addCategory(title: string): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, { title }, { headers: this.getHeaders() });
  }
}