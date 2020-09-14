// 'Player' of the game
export enum Player {
	_ = 0,
  X = 1,
	O = 2,
	X1 = 3,
	O1 = 4,
	X2 = 5,
	O2 = 6
}

// AI Difficulty
export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3
}

// Match count (used for AI)
export enum Matches {
  Two = 2,
  One = 4
}

// Current step of the shown dialog
export enum DialogStep {
  Top = 0,
  Opponent = 1,
  Player = 2,
  Difficulty = 3,
  Game = 4
}

