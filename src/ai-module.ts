import * as Consts from "./consts";
import * as Enums from "./enums";
import * as Interfaces from "./interfaces";
import * as AnalysisModule from "./analysis-module";

// Insert the possible turn of AI
export function robotInsertTurn(
  combination: Array<number>,
  buttons: Array<Interfaces.Buttons>
): number {
  let turn: number = null;

  for (let j: number = 0; j < combination.length; j++) {
    if (buttons[combination[j]].Player === Enums.Player._) {
      turn = combination[j];
      
      break;
    }
  }

  return turn;
}

// Get the buttons that aren't yet opened
export function getFreeButtons(
  buttons: Array<Interfaces.Buttons>
): Array<number> {
  let freeButtons: Array<number> = [];

  for (let i: number = 0; i < buttons.length; i++) {
    if (buttons[i].Match === true) {
      continue;
    }
    
    if (buttons[i].Active === false) {
      freeButtons.push(i);
    }
  }

  return freeButtons;
}

// Random move by AI
export function robotRandom(buttons: Array<Interfaces.Buttons>): number {
  let freeButtons: Array<number> = getFreeButtons(buttons);
  let random: number = Math.round(Math.random() * (freeButtons.length - 1));

  if (random >= 0) {
    return freeButtons[random];
  }
  else {
    return null;
  }
}

// Find combination for AI move
export function robotCombination(
  selectedMatches: Enums.Player,
  buttons: Array<Interfaces.Buttons>
): number {
  let turn: number = null;
  
  for (let i: number = 0; i < Consts.Combinations.length; i++) {
    let combination: Array<number> = Consts.Combinations[i];
    let open: Array<Enums.Player> = AnalysisModule.createOpened(combination, buttons);
    let analysis: Enums.Player = AnalysisModule.analyzeCombination(open);
  
    // First priority is 2 matches, then 1
    if (analysis === selectedMatches) {
      turn = robotInsertTurn(combination, buttons);

      break;
    }
  }

  return turn;
}

// Attack move by AI
export function robotAttack(
  tileIndex: number,
  aiPlayer: Enums.Player,
  buttons: Array<Interfaces.Buttons>
): number {
  if (tileIndex === null) {
    tileIndex = robotCombination(aiPlayer + Enums.Matches.One, buttons);
  }

  if (tileIndex === null) {
    tileIndex = robotCombination(aiPlayer + Enums.Matches.Two, buttons);
  }

  return tileIndex;
}

// Defend move by AI
export function robotDefend(
  aiPlayer: Enums.Player,
  buttons: Array<Interfaces.Buttons>
): number {
  let tileIndex: number = null;
  let human: Enums.Player = (aiPlayer === Enums.Player.X) ?
    Enums.Player.O : Enums.Player.X;

  tileIndex = robotCombination(human + Enums.Matches.One, buttons);

  return tileIndex;
}

// Move of the player (AI)
export function robotMove(
  turn: Enums.Player,
  aiPlayer: Enums.Player,
  aiDifficulty: Enums.Difficulty,
  buttons: Array<Interfaces.Buttons>
): number {
  if (turn === aiPlayer) {
    let tileIndex: number = null;

    switch (aiDifficulty) {
      case Enums.Difficulty.Easy:
        tileIndex = robotRandom(buttons);

        break;
      case Enums.Difficulty.Medium:
        tileIndex = robotAttack(tileIndex, aiPlayer, buttons);

        if (tileIndex === null) {
          tileIndex = robotRandom(buttons);
        }

        break;
      case Enums.Difficulty.Hard:
        tileIndex = robotCombination(aiPlayer + Enums.Matches.One, buttons);

        if (tileIndex === null) {
          tileIndex = robotDefend(aiPlayer, buttons);
        }

        if (tileIndex === null) {
          tileIndex = robotCombination(aiPlayer + Enums.Matches.Two, buttons);
        }

        if (tileIndex === null) {
          tileIndex = robotRandom(buttons);
        }

        break;
    }

    if (tileIndex !== null) {
      return tileIndex;
    }

    return null;
  }
}
