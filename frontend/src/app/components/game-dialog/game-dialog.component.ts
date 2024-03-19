import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-game-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-dialog.component.html',
  styleUrl: './game-dialog.component.css'
})
export class GameDialogComponent {
    isUpdateDialog: boolean = false;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<GameDialogComponent>, private router: Router) {}

    ngOnInit(): void {
        this.isUpdateDialog = this.data.type === 'update';
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    playGame(id: string): void {
        this.router.navigate(["/create"], { queryParams: { id } });
        this.dialogRef.close({ action: 'play' });
    }
}
