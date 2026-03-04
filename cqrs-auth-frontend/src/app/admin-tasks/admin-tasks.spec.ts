import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../auth';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tasks.html'
})
export class AdminTasks implements OnInit {

  users: any[] = [];
  tasks: any[] = [];

  taskData = {
    title: '',
    description: '',
    deadline: '',
    assignedToEmail: ''
  };

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers() {
    this.auth.getUsers().subscribe((res: any) => {
      this.users = res.filter((u: any) => u.role === 'User');
    });
  }

  loadTasks() {
    this.auth.getTasks().subscribe((res: any) => {
      this.tasks = res;
    });
  }

  addTask() {

    if (!this.taskData.assignedToEmail) {
      alert("Select user first");
      return;
    }

    this.auth.addTask(this.taskData).subscribe({
      next: () => {
        alert("Task Assigned Successfully ✅");
        this.taskData = { title: '', description: '', deadline: '', assignedToEmail: '' };
        this.loadTasks();
      },
      error: () => alert("Failed to add task")
    });
  }

  deleteTask(id: number) {
    if (!confirm("Delete this task?")) return;

    this.auth.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}