import { Card } from "./card";

export interface Game {
    _id: string;
    playerHand: Card[];
    dealerHand: Card[];
    playerTotal: number;
    dealerTotal: number;
    winner: string;
    status: string;
}
