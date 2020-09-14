import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Consts from "./consts";
import * as Enums from "./enums";
import * as Interfaces from "./interfaces";

class Game extends React.Component {
  // React state
  state: Interfaces.GameState;

  // Class constructor
  constructor(props: Object) {
		super(props);
    
    // Set the react state
    this.state = {
      buttons: [],
      aiPlayer: 0,
      aiDifficulty: 0,
      turn: 0,
      play: true,
      match: [],
      showDialog: true,
      winningPlayer: "",
      dialogStep: 0
    };
  }

  // ReactJS componentDidMount() method to initialize
	componentDidMount(): void {
    this.initialize();
  }

  // Initialize the game
  async initialize(): Promise<void> {
    await this.setState({ aiPlayer : 0 });
    await this.setState({ aiDifficulty : 0 });
    
    await this.playAgain();
    
    this.setState({ showDialog : true });
    this.setState({ dialogStep : 0 });
  }

  // Start the game with same settings
  async playAgain(): Promise<void> {
    await this.setState({ buttons : [] });
    await this.setState({
      turn : ((this.state.aiPlayer === Enums.Player.X) ?
        Enums.Player.O : Enums.Player.X
    )});
    await this.setState({ play : true });
    await this.setState({ match : [] });
    await this.setState({ winningPlayer : "" });
    await this.setState({ showDialog : false });
    await this.setState({ dialogStep : 4 });

    this.createMap();

    if (this.state.aiPlayer === Enums.Player.X) {
      this.robotMove();
    }
  }

  // Creates the tic tac toe map
  createMap(): void {
    let buttons: Array<Interfaces.Buttons> = [];
    
    for (let i: number = 0; i < 9; i++) {
      buttons.push({
        Player: 0,
        Active: false,
        Match: false,
      });
    }
    
    this.setState({ buttons : buttons });
  }

  // Event when the tile is clicked
  tileClick(e: Event): void {
    if (this.state.play === true) {
      if (this.state.turn === this.state.aiPlayer) {
        return;
      }

      let elm: HTMLButtonElement = e.target as HTMLButtonElement;

      this.humanMove(elm);
    }
  }

  // Proceed to next step of the dialog
  proceedToNext(): void {
    this.setState({ dialogStep : this.state.dialogStep + 1 });
  }

  // Choose the opponent to play with
  chooseOpponent(isRobot: boolean): void {
    if (isRobot === true) {
      this.proceedToNext();
    }
    else {
      this.setState({ turn : Enums.Player.X });
      this.setState({ dialogStep : 4 });
      this.setState({ showDialog : false });
    }
  }

  // Choose your player (VS AI)
  choosePlayer(chosenPlayer: Enums.Player): void {
    this.setState({ aiPlayer : ((chosenPlayer === Enums.Player.X) ?
      Enums.Player.O : Enums.Player.X)
    });

    this.proceedToNext();
  }

  // Choose the AI difficulty
  async chooseDifficulty(difficulty: Enums.Difficulty): Promise<void> {
    await this.setState({ aiDifficulty : difficulty });

    await this.setState({ dialogStep : 4 });
    await this.setState({ showDialog : false });

    if (this.state.aiPlayer === Enums.Player.X) {
      this.robotMove();
    }
  }

  // Analyze the provided combination if the player gets
  // 3 consecutives. For AI purposes, +2 of each was added
  // if has 2 combinations. +4 if has 1 combination.
  analyzeCombination(open: Array<Enums.Player>): Enums.Player {
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

  // Create array of opened combination
  createOpened(combination: Array<number>): Array<Enums.Player> {
    let open: Array<Enums.Player> = [];

    for (let i: number = 0; i < combination.length; i++) {
      let index: number = combination[i];

      open.push(this.state.buttons[index].Player);
    }
    
    return open;
  }

  // Find the combinations of the opened tiles
  findCombination(): boolean {
    for (let i: number = 0; i < Consts.Combinations.length; i++) {
      let combination: Array<number> = Consts.Combinations[i];
      let open: Array<Enums.Player> = this.createOpened(combination);
      let analysis: number = this.analyzeCombination(open);

      if (analysis === Enums.Player.X || analysis === Enums.Player.O) {
        this.setState({ play : false });
        this.setState({ match : combination });

        return true;
      }
    }

    return false;
  }
  
  // Get the buttons that aren't yet opened
  getFreeButtons(): Array<number> {
    let freeButtons: Array<number> = [];

    for (let i: number = 0; i < this.state.buttons.length; i++) {
      if (this.state.buttons[i].Match === true) {
        continue;
      }
      
      if (this.state.buttons[i].Active === false) {
        freeButtons.push(i);
      }
    }

    return freeButtons;
  }
  
  // Insert the possible turn of AI
  robotInsertTurn(combination: Array<number>): number {
    let turn: number = null;

    for (let j: number = 0; j < combination.length; j++) {
      if (this.state.buttons[combination[j]].Player === Enums.Player._) {
        turn = combination[j];
        
        break;
      }
    }

    return turn;
  }
  
  // Random move by AI
  robotRandom(): number {
    let freeButtons: Array<number> = this.getFreeButtons();
    let random: number = Math.round(Math.random() * (freeButtons.length - 1));

    if (random >= 0) {
      return freeButtons[random];
    }
    else {
      return null;
    }
  }
  
  // Find combination for AI move
  robotCombinaton(selectedMatches: Enums.Player): number {
    let turn: number = null;
    
    for (let i: number = 0; i < Consts.Combinations.length; i++) {
      let combination: Array<number> = Consts.Combinations[i];
      let open: Array<Enums.Player> = this.createOpened(combination);
      let analysis: Enums.Player = this.analyzeCombination(open);
    
      // First priority is 2 matches, then 1
      if (analysis === selectedMatches) {
        turn = this.robotInsertTurn(combination);

        break;
      }
    }

    return turn;
  }
  
  // Attack move by AI
  robotAttack(tileIndex: number): number {
    if (tileIndex === null) {
      tileIndex = this.robotCombinaton(this.state.aiPlayer + Enums.Matches.Two);
    }

    if (tileIndex === null) {
      tileIndex = this.robotCombinaton(this.state.aiPlayer + Enums.Matches.One);
    }

    return tileIndex;
  }
  
  // Defend move by AI
  robotDefend(): number {
    let tileIndex: number = null;
    let human: Enums.Player = (this.state.aiPlayer === Enums.Player.X) ?
      Enums.Player.O : Enums.Player.X;

    tileIndex = this.robotCombinaton(human + Enums.Matches.Two);

    return tileIndex;
  }
  
  // Move of the player (AI)
  robotMove(): void {
    if (this.state.turn === this.state.aiPlayer) {
      let tileIndex: number = null;

      switch (this.state.aiDifficulty) {
        case Enums.Difficulty.Easy:
          tileIndex = this.robotRandom();

          break;
        case Enums.Difficulty.Medium:
          tileIndex = this.robotAttack(tileIndex);

          if (tileIndex === null) {
            tileIndex = this.robotRandom();
          }

          break;
        case Enums.Difficulty.Hard:
          tileIndex = this.robotCombinaton(this.state.aiPlayer + Enums.Matches.Two);

          if (tileIndex === null) {
            tileIndex = this.robotDefend();
          }

          if (tileIndex === null) {
            tileIndex = this.robotCombinaton(this.state.aiPlayer + Enums.Matches.One);
          }

          if (tileIndex === null) {
            tileIndex = this.robotRandom();
          }

          break;
      }

      if (tileIndex !== null) {
        this.makeDecision(tileIndex);
      }
    }
  }
  
  // Move of the player (human)
  async humanMove(elm: HTMLButtonElement): Promise<void> {
    if (!elm.classList.contains("active")) {
      let tileIndex: number = parseInt(elm.dataset.tile);

      await this.makeDecision(tileIndex);
      
      if (this.state.aiPlayer === this.state.turn) {
        this.robotMove();
      }
    }
  }
  
  // Make decision on rendering the board
  async makeDecision(tileIndex: number): Promise<void> {
    let buttons: Array<Interfaces.Buttons> = this.state.buttons;
    
    if (tileIndex !== null) {
      buttons[tileIndex].Active = true;
      buttons[tileIndex].Player = this.state.turn;
    }
    
    this.setState({ buttons: buttons });

    if (this.findCombination() === true) {
      this.decideGameWin();

      return;
    }

    if (this.findAnotherTile() === false) {
      this.setState({ showDialog : true });

      return;
    }

    if (this.state.turn === Enums.Player.X) {
      await this.setState({ turn : Enums.Player.O });
    }
    else if (this.state.turn === Enums.Player.O) {
      await this.setState({ turn : Enums.Player.X });
    }
  }
  
  // Changes the buttons color into match
  changeButtonsToMatch(): void {
    let buttons: Array<Interfaces.Buttons> = this.state.buttons;
    
    for (let i: number = 0; i < this.state.match.length; i++) {
      let j: number = this.state.match[i];

      buttons[j].Match = true;
    }
    
    this.setState({ buttons: buttons });
  }
  
  // Find another available tile
  findAnotherTile(): boolean {
    let hasTile: boolean = false;

    for (let i: number = 0; i < this.state.buttons.length; i++) {
      if (this.state.buttons[i].Active === false) {
        hasTile = true;

        break;
      }
    }

    return hasTile;
  }

  // Game win event
  decideGameWin(): void {
    this.changeButtonsToMatch();

    this.setState({ showDialog : true });
    this.setState({ winningPlayer : Enums.Player[this.state.turn] });
  }
  
  // Render the value of each tiles
  renderTileValue(i: number): JSX.Element {
    if (this.state.buttons[i].Player === Enums.Player.X) {
      return (
        <div className="turn turn-0"></div>
      )
    }
    else if (this.state.buttons[i].Player === Enums.Player.O) {
      return (
        <svg viewBox="0 0 30 30" className="turn turn-1">
          <circle fill="transparent"
                  stroke="#d10827"
                  stroke-width="3"
                  r="10" cx="15" cy="15" />
        </svg>
      )
    }
  }
  
  // Render the tiles
  renderTiles(): Array<JSX.Element> {
    let tiles: Array<JSX.Element> = [];
    
    for (let i: number = 0; i < this.state.buttons.length; i++) {
      let className: string = "tile";
      
      if (this.state.buttons[i].Active === true) {
        className += " active";
      }
      
      if (this.state.buttons[i].Match === true) {
        className += " match";
      }
      
      if (this.state.play === false) {
        className += " disabled";
      }
      
      tiles.push(
        <button
          data-tile={ i }
          className={ className }
          onClick={ this.tileClick.bind(this)}>{ this.renderTileValue(i) }
        </button>
      );
    }
    
    return tiles;
  }
  
  // Render modal dialog boxes 
  renderModal(): JSX.Element {
    if (this.state.dialogStep === 0) {
      return (
        <div className="dialog-box">
          <div className="dialog-content">
            <p className="text-bold">{ Consts.GameTitle }</p>
            <p>Welcome to the example TicTacToe game I made.</p>
            <p>You may play this with your friend, or versus the computer.</p>
          </div>
          <div className="dialog-content">
            <button className="btn tile"
                    onClick={ this.proceedToNext.bind(this) }>
              Proceed to Game</button>
          </div>
        </div>
      );
    }
    else if (this.state.dialogStep === 1) {
      return (
        <div className="dialog-box">
          <div className="dialog-content">
            <p className="text-bold">{ Consts.GameTitle }</p>
            <p>Choose your opponent to play with.</p>
          </div>
          <div className="dialog-content">
            <button className="btn tile"
                    onClick={ this.chooseOpponent.bind(this, false) }>
              Friend</button> <button className="btn tile"
                    onClick={ this.chooseOpponent.bind(this, true) }>
              Computer</button>
          </div>
        </div>
      );
    }
    else if (this.state.dialogStep === 2) {
      return (
        <div className="dialog-box">
          <div className="dialog-content">
            <p className="text-bold">{ Consts.GameTitle }</p>
            <p>Choose your player.</p>
          </div>
          <div className="dialog-content">
            <button className="btn btn-turn tile"
                    onClick={ this.choosePlayer.bind(this, Enums.Player.X) }>
              <div className="turn turn-0"></div>
            </button> <button className="btn btn-turn tile"
                    onClick={ this.choosePlayer.bind(this, Enums.Player.O) }>
              <svg viewBox="0 0 30 30"
               className="turn turn-1">
                <circle fill="transparent"
                        stroke="#d10827"
                        stroke-width="3"
                        r="10" cx="15" cy="15" />
              </svg>
            </button>
          </div>
        </div>
      );
    }
    else if (this.state.dialogStep === 3) {
      return (
        <div className="dialog-box">
          <div className="dialog-content">
            <p className="text-bold">{ Consts.GameTitle }</p>
            <p>Choose the computer's difficulty.</p>
          </div>
          <div className="dialog-content">
          </div>
          <div className="dialog-content">
            <button className="btn tile"
                    onClick={ this.chooseDifficulty.bind(this, Enums.Difficulty.Easy) }>
              Easy</button> <button className="btn tile"
                    onClick={ this.chooseDifficulty.bind(this, Enums.Difficulty.Medium) }>
              Medium</button> <button className="btn tile"
                    onClick={ this.chooseDifficulty.bind(this, Enums.Difficulty.Hard) }>
              Hard</button>
          </div>
        </div>
      );
    }
    else if (this.state.dialogStep === 4) {
      let endMessage: JSX.Element;
      
      if (this.state.winningPlayer !== "") {
        endMessage = (
          <p>
            Player '{ this.state.winningPlayer }' won the game! Would you like to play again?
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
        <div className="dialog-box">
          <div className="dialog-content">
            <p className="text-bold">Game ended!</p>
            { endMessage }
          </div>
          <div className="dialog-content">
            <button className="btn tile"
                    onClick={ this.initialize.bind(this) }>
              Start New</button> <button className="btn tile"
                    onClick={ this.playAgain.bind(this) }>
              Play Again</button>
          </div>
        </div>
      );
    }
  }
  
  // Method to render the ReactJS Component
  render(): Array<JSX.Element> {
    let elms: Array<JSX.Element> = [];
    
    elms.push(<div className="tiles">{ this.renderTiles() }</div>);
    
    let modalWindow: string = "modal-window";
    
    if (this.state.showDialog === true) {
      modalWindow += " shown";
    }
    
    elms.push(<div className={ modalWindow }>{ this.renderModal() }</div>);
    
    return elms;
  }
}

ReactDOM.render(<Game />, document.querySelector("#game"));
