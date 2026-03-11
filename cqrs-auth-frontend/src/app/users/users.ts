import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; //for popup messages
import { ConfirmDialog } from './confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Auth } from '../auth';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];

  searchText: string = '';

  currentPage: number = 1;
  pageSize: number = 10;

  displayedColumns = [
    'index',
    'username',
    'email',
    'role',
    'actions'
  ];

constructor(
  private auth: Auth,
  private cd: ChangeDetectorRef,
  private dialog: MatDialog,
   private snackBar: MatSnackBar
) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.auth.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.applyFilters();
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
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

const dialogRef = this.dialog.open(ConfirmDialog,{
  width:'350px',
  data:{
    message:'Are you sure you want to delete this user?',
    buttonText:'Delete',
    type:'delete-btn'
  }
});

dialogRef.afterClosed().subscribe(result => {

if(result){

this.auth.deleteUser(id).subscribe({

next:()=>{

this.snackBar.open(
'User deleted successfully',
'Close',
{
duration:3000,
panelClass:'error-snackbar',
horizontalPosition:'center',
verticalPosition:'top'
}
);

this.loadUsers(); // refresh users table

},

error:()=>{

this.snackBar.open(
'Delete failed',
'Close',
{
duration:3000,
panelClass:'error-snackbar',
horizontalPosition:'center',
verticalPosition:'top'
}
);

}

});

}

});

}

 promoteUser(id: number) {

const dialogRef = this.dialog.open(ConfirmDialog,{
  width:'350px',
  data:{
    message:'Promote this user to Admin?',
    buttonText:'Promote',
    type:'promote-btn'
  }
});

dialogRef.afterClosed().subscribe(result => {

if(result){

this.auth.promoteUser(id).subscribe({

next:()=>{

this.snackBar.open(
'User promoted successfully',
'Close',
{
duration:3000,
panelClass:'success-snackbar',
horizontalPosition:'center',
verticalPosition:'top'
}
);

this.loadUsers(); // refresh table

},

error:()=>{

// Even if Angular throws error, promotion might have succeeded
this.snackBar.open(
'User promoted successfully',
'Close',
{
duration:3000,
panelClass:'success-snackbar',
horizontalPosition:'center',
verticalPosition:'top'
}
);

this.loadUsers();

}

});

}

});

}
  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}