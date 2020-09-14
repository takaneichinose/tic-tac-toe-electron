import * as Enums from "./enums";
import * as Interfaces from "./interfaces";

// Create array of opened combination
export function createOpened(
  combination: Array<number>,
  buttons: Array<Interfaces.Buttons>
): Array<Enums.Player> {
  let open: Array<Enums.Player> = [];

  for (let i: number = 0; i < combination.length; i++) {
    let index: number = combination[i];

    open.push(buttons[index].Player);
  }
  
  return open;
}

// Analyze the provided combination if the player gets
// 3 consecutives. For AI purposes, +2 of each was added
// if has 2 combinations. +4 if has 1 combination.
export function analyzeCombination(open: Array<Enums.Player>): Enums.Player {
  open.sort();

  let countX: number = 0;
  let countO: number = 0;

  for (let i in open) {
    if (open[i] === Enums.Player.X) {
      countX++;
    }
    else if (open[i] === Enums.Player.O) {
      countO++;
    }
  }

  if (countX === 3) {
    return Enums.Player.X;
  }
  else if (countO === 3) {
    return Enums.Player.O;
  }
  else if (countX === 1) {
    return Enums.Player.X1;
  }
  else if (countO === 1) {
    return Enums.Player.O1;
  }
  else if (countX === 2) {
    return Enums.Player.X2;
  }
  else if (countO === 2) {
    return Enums.Player.O2;
  }
  else {
    return null;
  }
}


