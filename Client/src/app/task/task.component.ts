import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  _id: string;
  title: string;
  desc: string;
  time: string;
  status: 'todo' | 'done';
  category: string;  // Add this
}
interface Category {
  _id: string;
  title: string;
  user_id: string;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'task.component.html',
  styles: [`
    .task-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background-color 0.3s ease;
    }

    .task-done {
      background-color: #f8f9fa;
    }

    .task-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .completed {
      text-decoration: line-through;
      color: #6c757d;
    }

    .checkbox-container {
      display: inline-block;
      position: relative;
      padding-left: 25px;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #fff;
      border: 2px solid #007bff;
      border-radius: 4px;
    }

    .checkbox-container:hover input ~ .checkmark {
      background-color: #f8f9fa;
    }

    .checkbox-container input:checked ~ .checkmark {
      background-color: #007bff;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }

    .checkbox-container .checkmark:after {
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .button-group {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .edit-input {
      width: 100%;
      padding: 8px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    textarea.edit-input {
      min-height: 100px;
      resize: vertical;
    }

    .status-select {
      margin: 8px 0;
    }

    .status-select select {
      margin-left: 8px;
      width: auto;
    }
  `]
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() taskUptimed = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();
  @Input() categories: Category[] = [];
  isEditing = false;
  isLoading = false;
  editedTask: Task = { _id: '', title: '', desc: '', time: '', status: 'todo' , category:''};

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  toggleEdit() {
    this.isLoading = false;
    console.log(this.isLoading)
    if (!this.isEditing) {
      this.editedTask = { ...this.task };
    }
    this.isEditing = !this.isEditing;
  }

  async toggleStatus() {
    this.isLoading = true;
    const updatedTask = {
      ...this.task,
      status: this.task.status === 'todo' ? 'done' : 'todo'
    };

    try {
      const response = await this.http.patch<Task>(
        `http://localhost:4000/tasks/${this.task._id}`,
        updatedTask,
        { headers: this.getHeaders() }
      ).toPromise();

      if (response) {
        this.taskUptimed.emit(response);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async uptimeTask() {
    if (!this.editedTask.title.trim()) return;
    this.isLoading = true;
    try {
      const response = await this.http.patch<Task>(
        `http://localhost:4000/tasks/${this.task._id}`,
        this.editedTask,
        { headers: this.getHeaders() }
      ).toPromise();

      if (response) {
        this.taskUptimed.emit(response);
        this.isEditing = false;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      this.isLoading = false;
    }
  }
  getCategoryTitle(categoryId: string): string {
    console.log(categoryId)
    const category = this.categories.find(c => c._id === categoryId);
    return category ? category.title : 'No Category';
  }

  async deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isLoading = true;
      try {
        await this.http.delete(
          `http://localhost:4000/tasks/${this.task._id}`,
          { headers: this.getHeaders() }
        ).toPromise();

        this.taskDeleted.emit(this.task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}