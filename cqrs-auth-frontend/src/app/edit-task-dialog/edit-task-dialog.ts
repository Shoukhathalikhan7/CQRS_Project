import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,   // ✅ VERY IMPORTANT
  imports: [
    CommonModule,     // ✅ fixes *ngFor
    FormsModule,      // ✅ fixes ngModel
    MatDialogModule,  // ✅ dialog
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
MatNativeDateModule
  ],
  templateUrl: './edit-task-dialog.html',
   styleUrls: ['./edit-task-dialog.css']
})
export class EditTaskDialog {

  editData: any;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editData = { ...data };
  }

  save() {
    this.dialogRef.close(this.editData);
  }

  close() {
    this.dialogRef.close();
  }
}