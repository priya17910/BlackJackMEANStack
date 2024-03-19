import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-winner-dialog',
  standalone: true,
  imports: [],
  templateUrl: './winner-dialog.component.html',
  styleUrl: './winner-dialog.component.css'
})
export class WinnerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<WinnerDialogComponent>, private router: Router) { }
  closeDialog(): void {
    this.dialogRef.close();
    this.router.navigate(["/"]);
  }
}
