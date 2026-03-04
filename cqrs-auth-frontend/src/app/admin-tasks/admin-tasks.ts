import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-tasks.html'
})
export class AdminTasks implements OnInit {

  users: any[] = [];
  tasks: any[] = [];

  selectedStatus: string = 'All'; // 🔥 Dropdown filter

  taskData = {
    title: '',
    description: '',
    deadline: '',
    assignedToEmail: ''
  };

  constructor(private auth: Auth, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  // ================= LOAD USERS =================
  loadUsers() {
    this.auth.getUsers().subscribe({
      next: (res: any) => {
        const data = res?.$values || res;
        this.users = data;
      },
      error: (err) => {
        console.error("LOAD USERS ERROR:", err);
      }
    });
  }

  // ================= LOAD TASKS =================
  loadTasks() {
    this.auth.getTasks().subscribe({
      next: (res: any) => {

        if (res && res.$values) {
          this.tasks = res.$values;
        } else if (Array.isArray(res)) {
          this.tasks = res;
        } else {
          this.tasks = [];
        }

        this.cd.detectChanges(); // 🔥 Force UI refresh
      },
      error: (err) => {
        console.error("LOAD TASK ERROR:", err);
        this.tasks = [];
        this.cd.detectChanges();
      }
    });
  }

  // ================= FILTER LOGIC =================
  get filteredTasks() {

    if (this.selectedStatus === 'All') {
      return this.tasks;
    }

    return this.tasks.filter(t => t.status === this.selectedStatus);
  }

  // ================= ADD TASK =================
  addTask() {

    if (!this.taskData.title ||
        !this.taskData.description ||
        !this.taskData.deadline ||
        !this.taskData.assignedToEmail) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      title: this.taskData.title,
      description: this.taskData.description,
      deadline: this.taskData.deadline,
      assignedToEmail: this.taskData.assignedToEmail,
      status: 'Pending'
    };

    this.auth.addTask(payload).subscribe({
      next: (response: any) => {

        alert("Task Assigned Successfully ✅");

        // 🔥 Immediate UI update
        this.tasks.unshift(response || payload);

        this.taskData = {
          title: '',
          description: '',
          deadline: '',
          assignedToEmail: ''
        };
      },
      error: (err) => {
        console.error("ADD TASK ERROR:", err);
        alert("Failed to add task");
      }
    });
  }

  // ================= DELETE TASK =================
  deleteTask(id: number) {

    if (!confirm("Delete this task?")) return;

    this.auth.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => {
        console.error("DELETE TASK ERROR:", err);
      }
    });
  }

  // ================= LOGOUT =================
  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

}