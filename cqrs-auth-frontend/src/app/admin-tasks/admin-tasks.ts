import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Auth } from '../auth';
import { ConfirmDialog } from '../users/confirm-dialog';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-tasks.html',
  styleUrls: ['./admin-tasks.css']
})
export class AdminTasks implements OnInit {

  users: any[] = [];
  tasks: any[] = [];

  selectedStatus: string = 'All';
  selectedUser: string = 'All';

  taskData = {
    title: '',
    description: '',
    deadline: '',
    assignedToEmail: ''
  };

  constructor(
    private auth: Auth,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }


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

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error("LOAD TASK ERROR:", err);
        this.tasks = [];
        this.cd.detectChanges();

      }

    });

  }


  get filteredTasks() {

    let tasks = this.tasks;

    if (this.selectedStatus !== 'All') {

      tasks = tasks.filter(t => t.status === this.selectedStatus);

    }

    if (this.selectedUser !== 'All') {

      tasks = tasks.filter(t => t.assignedToEmail === this.selectedUser);

    }

    return tasks;

  }


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

        alert("Task Assigned Successfully");

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


  deleteTask(id: number) {

    const dialogRef = this.dialog.open(ConfirmDialog,{

      width:'350px',

      data:{
        message:'Are you sure you want to delete this task?',
        buttonText:'Delete',
        type:'delete-btn'
      }

    });


    dialogRef.afterClosed().subscribe(result => {

      if(result){

        this.auth.deleteTask(id).subscribe({

          next:()=>{

            this.tasks = this.tasks.filter(t => t.id !== id);

            this.snackBar.open(

              'Task deleted successfully',
              'Close',

              {
                duration:3000,
                panelClass:'error-snackbar',
                horizontalPosition:'center',
                verticalPosition:'top'
              }

            );

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


  logout() {

    localStorage.clear();
    window.location.href = '/';

  }

}