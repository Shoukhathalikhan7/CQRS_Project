import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule],
  template: `

<h2 mat-dialog-title>Confirm Action</h2>

<mat-dialog-content>
  {{data.message}}
</mat-dialog-content>

<mat-dialog-actions align="end">

  <button mat-raised-button
          class="cancel-btn"
          (click)="close(false)">
    Cancel
  </button>

  <button mat-raised-button
          [ngClass]="data.type"
          (click)="close(true)">
    {{data.buttonText}}
  </button>

</mat-dialog-actions>
`,
styles:[`

.cancel-btn.mat-mdc-raised-button{
  background:#9aa0a6 !important;
  color:white !important;
  margin-right:10px;
}

.delete-btn.mat-mdc-raised-button{
  background:#e53935 !important;
  color:white !important;
}

.promote-btn.mat-mdc-raised-button{
  background:#2e7d32 !important;
  color:white !important;
}

`]
})
export class ConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){}

  close(result:boolean){
    this.dialogRef.close(result);
  }

}