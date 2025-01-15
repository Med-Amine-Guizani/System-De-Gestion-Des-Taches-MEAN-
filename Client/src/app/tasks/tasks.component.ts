import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskComponent } from '../task/task.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { TasksService } from '../taskservice.service';
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
  status: 'todo' | 'done';  // Add status
  category: string;       // Add category
}
interface NewTask {
  title: string;
  desc: string;
  time: string;
  category: string;
}



@Component({
  selector: 'app-tasks-component',
  template: `
  <app-navbar/>
<div class="tasks-container">
  <!-- Add Task Form -->
  <div class="task-form">
    <h2>Add New Task</h2>
    
    <!-- Task Form Error Display -->
    <div *ngIf="formError" class="error-message">
      {{ formError }}
    </div>
    
    <div class="form-group">
      <input
        type="text"
        [(ngModel)]="newTask.title"
        placeholder="Task Title"
        class="form-input"
      >
    </div>
    
    <!-- Category Selection -->
    <div class="form-group category-section">
      <select
        [(ngModel)]="newTask.category"
        class="form-input category-select"
      >
        <option value="">Select Category</option>
        <option *ngFor="let category of categories" [value]="category._id">
          {{ category.title }}
        </option>
      </select>
      
      <!-- Add New Category -->
      <div class="add-category-section" *ngIf="showAddCategory">
        <input
          type="text"
          [(ngModel)]="newCategory"
          placeholder="New Category Name"
          class="form-input"
          (keyup.enter)="addCategory()"
        >
        <button 
          (click)="addCategory()"
          [disabled]="!newCategory.trim() || isCategoryLoading"
          class="category-button"
        >
          {{ isCategoryLoading ? 'Saving...' : 'Save' }}
        </button>
        <button 
          (click)="cancelAddCategory()"
          class="category-button cancel"
        >
          Cancel
        </button>
      </div>
      
      <!-- Category Error Display -->
      <div *ngIf="categoryError" class="error-message">
        {{ categoryError }}
      </div>
      
      <button 
        *ngIf="!showAddCategory"
        (click)="showAddCategory = true"
        class="category-button add"
      >
        + Add Category
      </button>
    </div>

    <div class="form-group">
      <textarea
        [(ngModel)]="newTask.desc"
        placeholder="Task Description"
        class="form-input"
      ></textarea>
    </div>
    
    <div class="form-group">
      <input
        type="time"
        [(ngModel)]="newTask.time"
        class="form-input"
      >
    </div>
    
    <button 
      (click)="addTask()"
      [disabled]="isLoading || !newTask.title.trim()"
      class="add-button"
    >
      {{ isLoading ? 'Adding...' : 'Add Task' }}
    </button>
  </div>

  <!-- Timeline Display -->
  <div class="timeline-container">
    <h2>Daily Timeline</h2>
    
    <!-- Morning Timeline -->
    <div class="timeline-section">
      <h3>Morning</h3>
      <div class="timeline">
        <div class="timeline-hours">
          <div *ngFor="let hour of morningHours" class="hour-marker">
            {{ formatHour(hour) }}
          </div>
        </div>
        <div class="timeline-line"></div>
        <div class="tasks-timeline">
          <div *ngFor="let task of getMorningTasks()" 
               class="timeline-task"
               [style.left]="getTaskPosition(task, true)"
          >
            <app-task
  [task]="task"
  [categories]="categories"
  (taskUptimed)="onTaskUptimed($event)"
  (taskDeleted)="onTaskDeleted($event)"
></app-task>
          </div>
        </div>
      </div>
    </div>

    <!-- Afternoon Timeline -->
    <div class="timeline-section">
      <h3>Afternoon</h3>
      <div class="timeline">
        <div class="timeline-hours">
          <div *ngFor="let hour of afternoonHours" class="hour-marker">
            {{ formatHour(hour) }}
          </div>
        </div>
        <div class="timeline-line"></div>
        <div class="tasks-timeline">
          <div *ngFor="let task of getAfternoonTasks()" 
               class="timeline-task"
               [style.left]="getTaskPosition(task, false)"
          >
             <app-task
  [task]="task"
  [categories]="categories"
  (taskUptimed)="onTaskUptimed($event)"
  (taskDeleted)="onTaskDeleted($event)"
></app-task>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading" class="loading">Loading tasks...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  </div>
</div>
  `,
  styles:`
  /* Container Styles */
.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Form Styles */
.task-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.add-button:hover:not(:disabled) {
  background-color: #218838;
}

/* Category Section Styles */
.category-section {
  position: relative;
  margin-bottom: 20px;
}

.category-select {
  margin-bottom: 10px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-category-section {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
}

.category-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.category-button.add {
  background-color: #007bff;
  color: white;
}

.category-button.add:hover {
  background-color: #0056b3;
}

.category-button.cancel {
  background-color: #dc3545;
  color: white;
}

.category-button.cancel:hover {
  background-color: #c82333;
}

.category-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Timeline Container Styles */
.timeline-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timeline-section {
 margin-bottom: 40px;
  /* Add more spacing between timeline sections */
  padding-bottom: 220px; /* Increased padding to accommodate task cards */
}

.timeline-section h3 {
  color: #555;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 500;
}

.timeline {
  position: relative;
  margin: 20px 0;
  padding: 20px 0;
}

/* Timeline Hours Styles */
.timeline-hours {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 10px;
}

.hour-marker {
  position: relative;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
}

.timeline-line {
  position: relative;
  height: 4px;
  background-color: #ddd;
  margin: 10px 20px;
}

/* Tasks Timeline Styles */
.tasks-timeline {
  position: relative;
  min-height: 200px;
  margin-top: 20px;
}

.timeline-task {
  position: absolute;
  transition: all 0.3s ease;
  width: 250px;
  margin-top: 10px;
}

/* Loading and Error States */
.loading {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 15px;
}

.error {
  color: #dc3545;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #f8d7da;
}

/* Headings */
h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: 500;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .tasks-container {
    padding: 10px;
  }

  .timeline-task {
    width: 200px;
  }

  .add-category-section {
    flex-direction: column;
    gap: 5px;
  }

  .category-button {
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-form, .timeline-container {
  animation: fadeIn 0.3s ease-out;
}

/* Hover Effects */
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.category-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

/* Task Card Styles (if needed for the timeline) */
.task-card {
  background: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid #007bff;
  margin-bottom: 10px;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, TaskComponent, NavbarComponent]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  newTask: NewTask = {
    title: '',
    desc: '',
    time: '08:00',
    category: ''
  };
  
  newCategory: string = '';
  showAddCategory: boolean = false;
  isLoading: boolean = false;
  isCategoryLoading: boolean = false;
  error: string | null = null;
  formError: string | null = null;
  categoryError: string | null = null;
  
  morningHours = [8, 9, 10, 11, 12];
  afternoonHours = [13, 14, 15, 16, 17];

  private apiUrl = 'http://localhost:4000/tasks';
  private categoriesUrl = 'http://localhost:4000/categories';

  constructor(private http: HttpClient , private tasksService:TasksService) {}

  ngOnInit() {
    this.loadTasks();
    this.loadCategories();
  }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  async loadCategories() {
    try {
      this.categories = await this.tasksService.getCategories().toPromise() || [];
    } catch (error) {
      this.categoryError = 'Failed to load categories. Please refresh the page.';
      console.error('Error loading categories:', error);
    }
  }

  async addCategory() {
    if (!this.newCategory.trim()) return;
    
    this.isCategoryLoading = true;
    this.categoryError = null;

    try {
      const response = await this.tasksService.addCategory(this.newCategory.trim()).toPromise();
      if (response) {
        this.categories = [...this.categories, response];
        this.newCategory = '';
        this.showAddCategory = false;
      }
    } catch (error: any) {
      this.categoryError = error.error?.message || 'Failed to add category. Please try again.';
      console.error('Error adding category:', error);
    } finally {
      this.isCategoryLoading = false;
    }
  }

  cancelAddCategory() {
    this.showAddCategory = false;
    this.newCategory = '';
    this.categoryError = null;
  }

  async loadTasks() {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.tasks = await this.tasksService.getTasks().toPromise() || [];
    } catch (error) {
      this.error = 'Failed to load tasks. Please try again.';
      console.error('Error loading tasks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addTask() {
    if (!this.newTask.title.trim()) return;

    this.isLoading = true;
    this.formError = null;

    try {
      const response = await this.tasksService.addTask(this.newTask).toPromise();
      if (response) {
        this.tasks = [response, ...this.tasks];
        this.newTask = {
          title: '',
          desc: '',
          time: '08:00',
          category: ''
        };
      }
    } catch (error: any) {
      this.formError = error.error?.message || 'Failed to add task. Please try again.';
      console.error('Error adding task:', error);
    } finally {
      this.isLoading = false;
    }
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  getMorningTasks(): Task[] {
    return this.tasks.filter(task => {
      const hour = parseInt(task.time.split(':')[0]);
      return hour >= 8 && hour <= 12;
    });
  }

  getAfternoonTasks(): Task[] {
    return this.tasks.filter(task => {
      const hour = parseInt(task.time.split(':')[0]);
      return hour >= 13 && hour <= 17;
    });
  }

  getTaskPosition(task: Task, isMorning: boolean): string {
    const timeComponents = task.time.split(':');
    const hours = parseInt(timeComponents[0]);
    const minutes = parseInt(timeComponents[1]);
    
    let percentage: number;
    
    if (isMorning) {
      const totalMinutes = (hours - 8) * 60 + minutes;
      const totalTimelineMinutes = 4 * 60;
      percentage = (totalMinutes / totalTimelineMinutes) * 100;
    } else {
      const totalMinutes = (hours - 13) * 60 + minutes;
      const totalTimelineMinutes = 4 * 60;
      percentage = (totalMinutes / totalTimelineMinutes) * 100;
    }
    
    return `${Math.min(Math.max(percentage, 0), 100)}%`;
  }

  onTaskUptimed(uptimedTask: Task) {
    this.tasks = this.tasks.map(task => 
      task._id === uptimedTask._id ? uptimedTask : task
    );
  }

  onTaskDeleted(taskId: string) {
    this.tasks = this.tasks.filter(task => task._id !== taskId);
  }
}