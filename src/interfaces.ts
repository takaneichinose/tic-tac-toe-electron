import { Player } from "./enums";

export interface Buttons {
	Player: Player;
	Active: boolean;
	Match: boolean;
}

export interface GameState {
	buttons: Array<Buttons>;
	aiPlayer: number;
	aiDifficulty: number;
	turn: number;
	play: boolean;
	match: Array<number>;
	showDialog: boolean;
	winningPlayer: string;
	dialogStep: number
}
