import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HandComponent } from '../hand/hand.component';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { skip, take } from 'rxjs';
import { WinnerDialogComponent } from '../winner-dialog/winner-dialog.component';

@Component({
  selector: 'app-start-game',
  standalone: true,
  imports: [FormsModule, CommonModule, HandComponent, MatDialogModule],
  templateUrl: './start-game.component.html',
  styleUrl: './start-game.component.css'
})
export class StartGameComponent {
  game: Game = {
    _id: '',
    playerHand: [],
    dealerHand: [],
    playerTotal: 0,
    dealerTotal: 0,
    winner: '',
    status: 'ongoing'
  };
  gameId: string = '';
  startAfresh: boolean = false;
  constructor(private dialog: MatDialog, private gameService: GameService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.startNewGame();
  }
  checkStart(): void {
    this.startAfresh = true;
    this.startNewGame();
  }
  startNewGame(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.gameId = params['id'];

      if (this.gameId && this.gameId != '' && !this.startAfresh) {
        console.log(this.gameId);
        this.gameService.getGameById(this.gameId).subscribe(
          (data: Game) => {
            this.game = data;
          },
          (error) => {
            console.error('Error fetching game:', error);
          }
        );
      } else {
        console.log("Starting game from scratch");
        this.gameService.createGame().subscribe(
          (data: Game) => {
            console.log('New game started:', data);
            this.game = data;
          },
          (error: any) => {
            console.error('Error starting new game:', error);
          }
        );
      }
    });
  }
  dealCards(id: string): void {
    this.gameService.dealCards(id).subscribe(
      (data: Game) => {
        console.log('Cards dealt:', data);
        this.game = data;
        if (this.game.winner !== '') {
          this.openWinnerDialog(this.game.winner);
        }
      },
      (error) => {
        console.error('Error dealing cards:', error); // Handle error if any
      }
    );
  }

  hitAction(id: string): void {
    this.gameService.hitAction(id).subscribe(
      (data: Game) => {
        console.log('Hit Action:', data);
        this.game = data;
        if (this.game.winner !== '') {
          this.openWinnerDialog(this.game.winner);
        }
      },
      (error) => {
        console.error('Error in hit action:', error);
      }
    );
  }

  standAction(id: string): void {
    this.gameService.standAction(id).subscribe(
      (data: Game) => {
        console.log('Stand Action:', data);
        this.game = data;
        if (this.game.winner !== '') {
          this.openWinnerDialog(this.game.winner);
        }
      },
      (error) => {
        console.error('Error in stand action:', error);
      }
    );
  }

  homePage(): void {
    this.router.navigate(["/"]);
  }
  endGame(id: string): void {
    this.gameService.endGame(id).subscribe(
      (data: Game) => {
        console.log('End Game:', data);
        if (this.game.winner !== '') {
          this.openWinnerDialog(this.game.winner);
        }
        this.router.navigate(["/"]);
      },
      (error) => {
        console.error('Error in ending game:', error);
      }
    );
  }
  openWinnerDialog(winner: string): void {
    if (winner !== 'Tie') {
      this.dialog.open(WinnerDialogComponent, {
        width: '30%',
        data: { message: `${winner} wins!` }
      });
    }
    else {
      this.dialog.open(WinnerDialogComponent, {
        width: '20%',
        height: '50%',
        data: { message: `${winner}` }
      });
    }
  }
}
