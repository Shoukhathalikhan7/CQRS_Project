import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { LearningService } from '../services/learning-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-learning',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './admin-learning.html',
  styleUrls: ['./admin-learning.css']
})
export class AdminLearningComponent implements OnInit {

  view: 'list' | 'add' | 'detail' = 'list';

  courses: any[] = [];
  selectedCourse: any;

  newCourse = { title: '', description: '' };
  newVideo = { title: '', videoUrl: '' };

  constructor(
    private service: LearningService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  // ================= LOAD =================
  loadCourses() {
    this.service.getAll().subscribe((res: any) => {

      const data = res?.$values || res || [];

      this.courses = data.map((c: any) => ({
        ...c,
        isNew: false,
        isModified: false,
        isDeleted: false,
        videos: (c.videos || []).map((v: any) => ({
          ...v,
          isNew: false,
          isModified: false,
          isDeleted: false
        }))
      }));

      this.cd.detectChanges();
    });
  }

  // ================= NAV =================
  openAddCourse() {
    this.view = 'add';
    this.newCourse = { title: '', description: '' };
  }

  openCourse(i: number) {
    this.selectedCourse = this.courses[i];
    this.view = 'detail';
  }

  backToList() {
    this.view = 'list';
  }

  // ================= COURSE =================
  saveCourseLocal() {
    this.courses.push({
      id: 0,
      title: this.newCourse.title,
      description: this.newCourse.description,
      videos: [],
      isNew: true,
      isModified: false,
      isDeleted: false
    });

    this.view = 'list';
  }

  editCourse(course: any) {
    course.isModified = true;
  }

deleteCourse(course: any, index: number) {

  if (course.id === 0) {
    this.courses.splice(index, 1);
  } 
  else {
    course.isDeleted = true;
    course.isModified = true; // 🔥 IMPORTANT
  }
}

  isAdding = false;
  // ================= VIDEO =================
addVideoToCourse() {

  if (!this.newVideo.title?.trim() || !this.newVideo.videoUrl?.trim()) return;

  const videoToAdd = {
    id: 0,
    title: this.newVideo.title.trim(),
    videoUrl: this.newVideo.videoUrl.trim(),
    isNew: true,
    isModified: false,
    isDeleted: false
  };

  this.selectedCourse.videos.push(videoToAdd);

  this.selectedCourse.isModified = true;

  this.newVideo = { title: '', videoUrl: '' };
}

  editVideo(v: any) {
    v.isModified = true;
    this.selectedCourse.isModified = true;
  }

deleteVideo(v: any, index: number) {

  this.selectedCourse.videos[index] = {
    ...v,
    isDeleted: true,
    isModified: true
  };

  this.selectedCourse.isModified = true;

  this.selectedCourse.videos = [...this.selectedCourse.videos];
}

  // ================= SAVE ALL =================
saveAllCourses() {

  const payload = {
    courses: this.courses
      .filter(c => c.isNew || c.isModified || c.isDeleted) // 🔥 ONLY CHANGED COURSES
      .map(c => ({

        id: c.id,
        title: c.title,
        description: c.description,
        isDeleted: c.isDeleted,

videos: (c.videos || [])
.filter((v: any) =>
  v.isDeleted === true || v.isNew === true || v.isModified === true
)
  .map((v: any) => ({
    id: v.id,
    title: v.title,
    videoUrl: v.videoUrl,
    isDeleted: v.isDeleted === true // 🔥 FORCE BOOLEAN
  }))

      }))
  };

  console.log("FINAL CLEAN PAYLOAD 🔥", payload);

  if (payload.courses.length === 0) {
    alert("No changes to save ❌");
    return;
  }

  this.service.upsert(payload).subscribe({
    next: () => {
      alert('Saved successfully ✅');
      this.loadCourses();
    },
    error: (err) => {
      console.error(err);
      alert('Failed ❌');
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

  // COURSE EDIT
tempCourse: any = {};

enableCourseEdit() {
  this.selectedCourse.isEditing = true;
  this.tempCourse = { ...this.selectedCourse };
}

saveCourseEdit() {
  this.selectedCourse.isEditing = false;
  this.selectedCourse.isModified = true;
}

cancelCourseEdit() {
  Object.assign(this.selectedCourse, this.tempCourse);
  this.selectedCourse.isEditing = false;
}

// VIDEO MODAL
isVideoModalOpen = false;
editingVideo: any = {};
tempVideo: any = {};

openVideoEdit(v: any) {
  this.editingVideo = v;
  this.tempVideo = { ...v };
  this.isVideoModalOpen = true;
}

closeVideoModal() {
  this.isVideoModalOpen = false;
}

saveVideoEdit() {
  this.editingVideo.isModified = true;
  this.selectedCourse.isModified = true;
  this.isVideoModalOpen = false;
}

  logout() {
    localStorage.clear();
    window.location.replace('/');
  }
}