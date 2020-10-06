# Tic Tac Toe VS AI
This is a reimplementation of Tic Tac Toe Game with NodeJS, ElectronJS, Webpack, Typescript, and ReactJS

I used [electron-packager](https://github.com/electron/electron-packager) in package distribution.

## Description

TicTacToe game with multiple options:

I made this game to practice my skill in creating AI (Artificial Intelligence).

I used ReactJS to make all of the functionalities.

You may choose your opponent whether if it is human or AI.

If you're playing with a human, you may play with your friend beside you. You may play the game alternatively. 

If you're playing with AI, you may choose from 3 difficulties:

1. Easy

   The AI will just randomly enter the symbol anywhere on the open block.
   
1. Medium

   The AI will focus on attack. If there are 2 symbols opened, the AI will try to open the 3rd closed block to make a win.

1. Hard

   The AI will focus on defense. If there are 2 opened symbol by the player, the AI will try to block the way.

This description is exactly the same with my previous project, with implementation on web only.

## Installation

To make this work, at least latest version on NodeJS is required.

Run these commands on the system console.

1. Clone the project.

   ``` git clone https://github.com/takaneichinose/tic-tac-toe-electron.git ```

1. Install the dependencies using NodeJS (npm).

   ``` npm install ```

1. Run the project.

   ``` npm start ```

1. Distribute the project.

   Binaries can be created by running the below npm commands:
   
   ``` npm run build ```
   
   Just to ensure that the source is built.
   
   ``` npm run dist-all ```
   
   Create distributions in all of the platforms.
