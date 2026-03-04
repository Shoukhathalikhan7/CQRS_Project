import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  tasks: any[] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("Dashboard Loaded");
    this.loadMyTasks();
  }

  loadMyTasks(): void {
    this.auth.getMyTasks().subscribe({
      next: (res: any[]) => {
        console.log("My Tasks:", res);
        this.tasks = [...res];   // 🔥 Important
        this.cd.detectChanges(); // 🔥 Force UI update
      },
      error: (err) => {
        console.error("Error loading tasks:", err);
      }
    });
  }
  markCompleted(id: number) {

  const payload = {
    status: 'Completed'
  };

  this.auth.updateTask(id, payload).subscribe({
    next: () => {
      this.loadMyTasks();  // reload list
    },
    error: (err) => {
      console.error("Update error:", err);
    }
  });
}


  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}