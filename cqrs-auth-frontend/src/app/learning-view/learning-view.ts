import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { Auth } from '../auth';

@Component({
  selector: 'app-learning-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './learning-view.html',
  styleUrls: ['./learning-view.css']
})
export class LearningView implements OnInit {

  courses: any[] = [];

  constructor(
    private auth: Auth,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLearning();
  }

  // ================= LOAD LEARNING =================
  loadLearning(): void {
    this.auth.getLearningCourses().subscribe({
      next: (res: any) => {

        const data = res?.$values || res || [];

        this.courses = data.map((c: any) => ({
          title: c.title,
          description: c.description,
          videos: (c.videos || []).filter((v: any) => !v.isDeleted)
        }));

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Error loading learning:", err);
      }
    });
  }

  // ================= YOUTUBE =================
  getSafeUrl(url: string) {
    let id = '';

    if (url.includes('watch?v=')) {
      id = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1];
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }

  // ================= LOGOUT =================
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}