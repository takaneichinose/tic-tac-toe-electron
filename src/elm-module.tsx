import * as React from "react";
import * as Consts from "./consts";
import * as Enums from "./enums";
import * as Interfaces from "./interfaces";

// Render the value of each tiles
export function renderTileValue(buttons: Array<Interfaces.Buttons>, i: number): JSX.Element {
  if (buttons[i].Player === Enums.Player.X) {
    return (
      <div className="turn turn-0"></div>
    )
  }
  else if (buttons[i].Player === Enums.Player.O) {
    return (
      <svg viewBox="0 0 30 30" className="turn turn-1">
        <circle fill="transparent"
                stroke="#d10827"
                strokeWidth="3"
                r="10" cx="15" cy="15" />
      </svg>
    )
  }
}

// Render the tiles
export function renderTiles(
  buttons: Array<Interfaces.Buttons>,
  play: boolean,
  tileClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
): Array<JSX.Element> {
  let tiles: Array<JSX.Element> = [];
  
  for (let i: number = 0; i < buttons.length; i++) {
    let className: string = "tile";
    
    if (buttons[i].Active === true) {
      className += " active";
    }
    
    if (buttons[i].Match === true) {
      className += " match";
    }
    
    if (play === false) {
      className += " disabled";
    }
    
    tiles.push(
      <button key={ "btn_tile_" + i }
              data-tile={ i }
              className={ className }
              onClick={ tileClick }>
          { renderTileValue(buttons, i) }
      </button>
    );
  }
  
  return tiles;
}

// Render modal dialog boxes 
export function renderModal(
  dialogStep: Enums.DialogStep,
  winningPlayer: string,
  proceedToNext: (event: React.MouseEvent<HTMLButtonElement>) => void,
  opponentHuman: (event: React.MouseEvent<HTMLButtonElement>) => void,
  opponentRobot: (event: React.MouseEvent<HTMLButtonElement>) => void,
  playerX: (event: React.MouseEvent<HTMLButtonElement>) => void,
  playerO: (event: React.MouseEvent<HTMLButtonElement>) => void,
  difficultyEasy: (event: React.MouseEvent<HTMLButtonElement>) => void,
  difficultyMedium: (event: React.MouseEvent<HTMLButtonElement>) => void,
  difficultyHard: (event: React.MouseEvent<HTMLButtonElement>) => void,
  initialize: (event: React.MouseEvent<HTMLButtonElement>) => void,
  playAgain: (event: React.MouseEvent<HTMLButtonElement>) => void,
): JSX.Element {
  if (dialogStep === Enums.DialogStep.Top) {
    return (
      <div className="dialog-box" key="modal_top">
        <div className="dialog-content">
          <p className="text-bold">{ Consts.GameTitle }</p>
          <p>Welcome to the example TicTacToe game I made.</p>
          <p>You may play this with your friend, or versus the computer.</p>
        </div>
        <div className="dialog-content">
          <button className="btn tile" onClick={ proceedToNext }>
            Proceed to Game</button>
        </div>
      </div>
    );
  }
  else if (dialogStep === Enums.DialogStep.Opponent) {
    return (
      <div className="dialog-box" key="modal_opponent">
        <div className="dialog-content">
          <p className="text-bold">{ Consts.GameTitle }</p>
          <p>Choose your opponent to play with.</p>
        </div>
        <div className="dialog-content">
          <button className="btn tile" onClick={ opponentHuman }>
            Friend
          </button> <button className="btn tile" onClick={ opponentRobot }>
            Computer
          </button>
        </div>
      </div>
    );
  }
  else if (dialogStep === Enums.DialogStep.Player) {
    return (
      <div className="dialog-box" key="modal_player">
        <div className="dialog-content">
          <p className="text-bold">{ Consts.GameTitle }</p>
          <p>Choose your player.</p>
        </div>
        <div className="dialog-content">
          <button className="btn btn-turn tile" onClick={ playerX }>
            <div className="turn turn-0"></div>
          </button> <button className="btn btn-turn tile" onClick={ playerO }>
            <svg viewBox="0 0 30 30"
                 className="turn turn-1">
              <circle fill="transparent"
                      stroke="#d10827"
                      strokeWidth="3"
                      r="10" cx="15" cy="15" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  else if (dialogStep === Enums.DialogStep.Difficulty) {
    return (
      <div className="dialog-box" key="modal_difficulty">
        <div className="dialog-content">
          <p className="text-bold">{ Consts.GameTitle }</p>
          <p>Choose the computer's difficulty.</p>
        </div>
        <div className="dialog-content">
        </div>
        <div className="dialog-content">
          <button className="btn tile" onClick={ difficultyEasy }>
            Easy
          </button> <button className="btn tile" onClick={ difficultyMedium }>
            Medium
          </button> <button className="btn tile" onClick={ difficultyHard }>
            Hard
          </button>
        </div>
      </div>
    );
  }
  else if (dialogStep === Enums.DialogStep.Game) {
    let endMessage: JSX.Element;
    
    if (winningPlayer !== "") {
      endMessage = (
        <p>
          Player '{ winningPlayer }' won the game! Would you like to play again?
        </p>
      );
    }
    else {
      endMessage = (
        <p>
          The match is a draw! Would you like to play again?
        </p>
      );
    }
    
    return (
      <div className="dialog-box" key="modal_end">
        <div className="dialog-content">
          <p className="text-bold">Game ended!</p>
          { endMessage }
        </div>
        <div className="dialog-content">
          <button className="btn tile" onClick={ initialize }>
            Start New
          </button> <button className="btn tile" onClick={ playAgain }>
            Play Again
          </button>
        </div>
      </div>
    );
  }
}
