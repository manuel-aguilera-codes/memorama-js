import "../sass/main.scss";

import Game from "./class/game";
import Box from "./class/box";

let resetButton = document.getElementById("reset");

resetButton.addEventListener("click", () => {
  Game.resetGame();
});

let rowsCols = Game.askUserSize();

let juego = new Game(rowsCols.rows, rowsCols.cols, "game");
