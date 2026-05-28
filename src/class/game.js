import { shuffleArray } from "../utils/utils";
import Box from "./box";

class Game {
  rows;
  cols;
  idElement;
  boxes;
  container;

  constructor(rows, cols, idElement = "game") {
    this.rows = rows;
    this.cols = cols;
    this.idElement = idElement;
    this.container = document.getElementById(idElement);
    this.boxes = [];
    this.createBoxes();
    this.paintBoxes();
  }

  createRandomColors() {
    //Creamos array con 15 colores aleatorios
    let randomColors = [];

    for (let i = 0; i < (this.cols * this.rows) / 2; i++) {
      let red = Math.floor(Math.random() * 255);
      let green = Math.floor(Math.random() * 255);
      let blue = Math.floor(Math.random() * 255);
      let color = `rgb(${red}, ${green}, ${blue})`;
      randomColors.push(color);
    }

    //Hacemos array de 30 elementos con 2 de cada color y lo barajeamos
    randomColors = [...randomColors, ...randomColors];
    shuffleArray(randomColors);

    return randomColors;
  }

  createBoxes() {
    let ColorIndex = 0;
    let arrayColors = this.createRandomColors();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let box = new Box(arrayColors[ColorIndex]);
        ColorIndex++;
        this.boxes.push(box);
      }
    }
  }

  paintBoxes() {
    this.setGridTemplate();
    this.boxes.map((box) => {
      let newBoxDiv = document.createElement("div");
      newBoxDiv.classList.add("box");
      this.container.append(newBoxDiv);
    });
  }

  setGridTemplate() {
    this.container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
  }

  static askUserSize() {
    let rows = prompt("Introduzca el número de filas");
    let cols = prompt("Introduzca número de columnas");

    while ((rows * cols) % 2 !== 0) {
      rows = prompt(
        "Introduzca el número de filas nuevamente, el número de cartas debe ser par",
      );
      cols = prompt(
        "Introduzca número de columnas nuevamente, el número de cartas debe ser par",
      );
    }

    return {
      rows: rows,
      cols: cols,
    };
  }
}

export default Game;
