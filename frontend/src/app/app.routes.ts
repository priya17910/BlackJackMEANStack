import { Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { StartGameComponent } from './components/start-game/start-game.component';

export const routes: Routes = [
    { path: '', component: GameListComponent },
    { path: 'create', component: StartGameComponent },
    { path: ':id', component: GameListComponent },
    { path: 'deal/:id', component: StartGameComponent },
    { path: 'update/:id', component: GameListComponent },
    { path: 'hit/:id', component: StartGameComponent },
    { path: 'stand/:id', component: StartGameComponent },
    { path: 'end/:id', component: StartGameComponent }
];
