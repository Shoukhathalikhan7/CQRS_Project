import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Auth } from '../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  tasks: any[] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyTasks();
  }

  loadMyTasks(): void {

    this.auth.getMyTasks().subscribe({

      next: (res: any[]) => {

        this.tasks = [...res];
        this.cd.detectChanges();

      },

      error: (err) => {
        console.error("Error loading tasks:", err);
      }

    });

  }

  markCompleted(id: number) {

    const payload = { status: 'Completed' };

    this.auth.updateTask(id, payload).subscribe({

      next: () => {
        this.loadMyTasks();
      },

      error: (err) => {
        console.error("Update error:", err);
      }

    });

  }
isStartingSoon(deadline: string): boolean {

  const today = new Date();
  const dueDate = new Date(deadline);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  return diffDays <= 2 && diffDays >= 0;

}


  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}