import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Consts from "./consts";
import * as Enums from "./enums";
import * as Interfaces from "./interfaces";
import * as AnalysisModule from "./analysis-module";
import * as AIModule from "./ai-module";
import * as ElmModule from "./elm-module";

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
      dialogStep: Enums.DialogStep.Top
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
    this.setState({ dialogStep : Enums.DialogStep.Top });
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
    await this.setState({ dialogStep : Enums.DialogStep.Game });

    this.createMap();

    if (this.state.aiPlayer === Enums.Player.X) {
      let tileIndexAI: number = AIModule.robotMove(
        this.state.turn,
        this.state.aiPlayer,
        this.state.aiDifficulty,
        this.state.buttons
      );

      if (tileIndexAI !== null) {
        await this.makeDecision(tileIndexAI);
      }
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
      this.setState({ dialogStep : Enums.DialogStep.Game });
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

    await this.setState({ dialogStep : Enums.DialogStep.Game });
    await this.setState({ showDialog : false });

    if (this.state.aiPlayer === Enums.Player.X) {
      let tileIndexAI: number = AIModule.robotMove(
        this.state.turn,
        this.state.aiPlayer,
        this.state.aiDifficulty,
        this.state.buttons
      );

      if (tileIndexAI !== null) {
        await this.makeDecision(tileIndexAI);
      }
    }
  }

  // Find the combinations of the opened tiles
  findCombination(): boolean {
    for (let i: number = 0; i < Consts.Combinations.length; i++) {
      let combination: Array<number> = Consts.Combinations[i];
      let open: Array<Enums.Player> = AnalysisModule.createOpened(
        combination,
        this.state.buttons
      );
      let analysis: number = AnalysisModule.analyzeCombination(open);

      if (analysis === Enums.Player.X || analysis === Enums.Player.O) {
        this.setState({ play : false });
        this.setState({ match : combination });

        return true;
      }
    }

    return false;
  }

  // Make decision on rendering the board
  async makeDecision(tileIndex: number): Promise<void> {
    if (typeof tileIndex === "undefined") {
      return;
    }

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
  
  // Move of the player (human)
  async humanMove(elm: HTMLButtonElement): Promise<void> {
    if (!elm.classList.contains("active")) {
      let tileIndex: number = parseInt(elm.dataset.tile);

      await this.makeDecision(tileIndex);
      
      if (this.state.aiPlayer === this.state.turn) {
        let tileIndexAI: number = AIModule.robotMove(
          this.state.turn,
          this.state.aiPlayer,
          this.state.aiDifficulty,
          this.state.buttons
        );

        if (tileIndexAI !== null) {
          await this.makeDecision(tileIndexAI);
        }
      }
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
  
  // Method to render the ReactJS Component
  render(): Array<JSX.Element> {
    let elms: Array<JSX.Element> = [];
    
    elms.push(
      <div className="tiles" key="render_tiles">
        { ElmModule.renderTiles(
          this.state.buttons,
          this.state.play,
          this.tileClick.bind(this)
        ) }
      </div>
    );
    
    let modalWindow: string = "modal-window";
    
    if (this.state.showDialog === true) {
      modalWindow += " shown";
    }
    
    elms.push(
      <div className={ modalWindow } key="render_modal">
        { ElmModule.renderModal(
          this.state.dialogStep,
          this.state.winningPlayer,
          this.proceedToNext.bind(this),
          this.chooseOpponent.bind(this, false),
          this.chooseOpponent.bind(this, true),
          this.choosePlayer.bind(this, Enums.Player.X),
          this.choosePlayer.bind(this, Enums.Player.O),
          this.chooseDifficulty.bind(this, Enums.Difficulty.Easy),
          this.chooseDifficulty.bind(this, Enums.Difficulty.Medium),
          this.chooseDifficulty.bind(this, Enums.Difficulty.Hard),
          this.initialize.bind(this),
          this.playAgain.bind(this)
        ) }
      </div>
    );
    
    return elms;
  }
}

ReactDOM.render(<Game />, document.querySelector("#game"));
