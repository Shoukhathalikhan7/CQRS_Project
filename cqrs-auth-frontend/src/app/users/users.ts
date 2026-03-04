import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { FormsModule } from '@angular/forms';     
import { Auth } from '../auth';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,          
  imports: [CommonModule, FormsModule, RouterModule],   
  templateUrl: './users.html'
})
export class Users implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  loading=false;

  searchText: string = '';


  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private auth: Auth,
  private cd: ChangeDetectorRef) {
    
  }

ngOnInit(): void {
  this.loadUsers();
}

loadUsers() {
  this.loading=true;
  this.auth.getUsers().subscribe({
    next: (res: any) => {
      this.users = res;
      this.loading=false;
      this.cd.markForCheck();
      this.applyFilters();  
    },
    error: (err: any) => {
      console.error(err);
    }
  });
}

 applyFilters() {

  if (!this.searchText || this.searchText.trim() === '') {
    this.filteredUsers = [...this.users];
  } else {
    const text = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.username.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text)
    );
  }

  this.currentPage = 1;
  this.updatePagination();
}

 updatePagination() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedUsers = this.filteredUsers.slice(start, end);
}

  totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

deleteUser(id: number) {

  if (!confirm('Are you sure you want to delete this user?')) return;

  this.auth.deleteUser(id).subscribe({

    next: (res: any) => {

      if (res && res.success) {

        alert(res.message);

        // Remove instantly from UI
        this.users = this.users.filter(u => u.id !== id);

        this.applyFilters();   // refresh pagination

      } else {
        alert("Delete failed");
      }
    },

    error: (err: any) => {
      console.error("DELETE ERROR:", err);
      alert("Delete failed");
    }

  });
}

  promoteUser(id: number) {

    if (!confirm('Promote this user to Admin?')) return;

    this.auth.promoteUser(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.users = this.users.filter(u => u.id !== id);
        this.applyFilters();
      },
      error: (err: any) => {   // 🔥 FIXED TYPE
        console.error(err);
        alert("Promote failed");
      }
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}