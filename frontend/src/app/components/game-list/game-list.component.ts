import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { GameDialogComponent } from '../game-dialog/game-dialog.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GameDialogComponent, CommonModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
    games: Game[] = [];
    game: Game | undefined;
    constructor(private gameService: GameService, private dialog: MatDialog, private router: Router) { }

    ngOnInit(): void {
        this.getAllGames();
    }

    getAllGames(): void {
        this.gameService.getAllGames().subscribe(
            (data: Game[]) => {
                this.games = data;
            },
            (error) => {
                console.error('Error fetching games:', error);
            }
        );
    }

    getGameById(id: string): void {
        this.gameService.getGameById(id).subscribe(
            (data: Game) => {
                this.game = data;
                this.openDialog(this.game);
            },
            (error) => {
                console.error('Error fetching game:', error);
            }
        );
    }

    openDialog(game: Game): void {
        const dialogRef = this.dialog.open(GameDialogComponent, {
            width: '30%',
            data: game
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
    }

    updateGame(id: string): void {
        this.gameService.updateGame(id).subscribe(
            (data: Game) => {
                this.game = data;
                this.openUpdateDialog(this.game);
            },
            (error) => {
                console.error('Error updating game:', error);
            }
        );
    }

    openUpdateDialog(game: Game): void {
        const dialogRef = this.dialog.open(GameDialogComponent, {
            width: '30%',
            data: {
                game: game,
                type: 'update'
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
    }

    endGame(id: string): void {
        this.gameService.endGame(id).subscribe(
            (data: Game) => {
                console.log('End Game:', data);
            },
            (error) => {
                console.error('Error in ending game:', error);
            }
        );
    }

    confirmDelete(gameId: string): void {
        const confirmDelete = window.confirm('Are you sure you want to delete this game?');
        if (confirmDelete) {
            this.deleteGame(gameId);
        }
    }

    deleteGame(id: string): void {
        this.gameService.deleteGame(id).subscribe(
            (data: Game) => {
                console.log('Game Deleted:', data);
                this.gameService.getAllGames().subscribe(
                  (data: Game[]) => {
                      this.games = data;
                  },
                  (error) => {
                      console.error('Error fetching games:', error);
                  }
              );
            },
            (error) => {
                console.error('Error in deleting game:', error);
            }
        );
    }
}
