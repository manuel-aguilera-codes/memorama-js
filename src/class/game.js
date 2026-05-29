import { shuffleArray } from "../utils/utils";
import Box from "./box";

class Game {
  rows;
  cols;
  idElement;
  boxes;
  container;
  divs;
  bloqueado;
  tarjeta1;
  tarjeta2;
  paresAbiertos;

  constructor(rows, cols, idElement = "game") {
    this.rows = rows;
    this.cols = cols;
    this.idElement = idElement;
    this.container = document.getElementById(idElement);
    this.boxes = [];
    this.createBoxes();
    this.paintBoxes();
    this.divs = document.querySelectorAll("#game .box");
    this.bloqueado = false;
    this.tarjeta1 = null;
    this.tarjeta2 = null;
    this.paresAbiertos = 0;
    this.inicio = null;
    this.setEventListeners();
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
    let index = 0;
    this.boxes.map((box) => {
      let newBoxDiv = document.createElement("div");
      newBoxDiv.classList.add("box");
      newBoxDiv.dataset.color = box.color;
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

  comprobarIgualdad = (event) => {
    if (this.bloqueado === true) return;

    let tarjetaClickeada = event.target;
    tarjetaClickeada.style.backgroundColor = tarjetaClickeada.dataset.color;

    if (this.tarjeta1 === null) {
      if (this.inicio === null) {
        this.inicio = Date.now();
      }
      this.tarjeta1 = tarjetaClickeada;
    } else {
      this.tarjeta2 = tarjetaClickeada;
      this.bloqueado = true;

      if (this.tarjeta1.dataset.color === this.tarjeta2.dataset.color) {
        this.tarjeta1 = null;
        this.tarjeta2 = null;
        this.bloqueado = false;
        this.paresAbiertos = this.paresAbiertos + 1;
      } else {
        setTimeout(() => {
          this.tarjeta1.style.backgroundColor = "black";
          this.tarjeta2.style.backgroundColor = "black";
          this.tarjeta1 = null;
          this.tarjeta2 = null;
          this.bloqueado = false;
        }, 500);
      }

      if (this.paresAbiertos === (this.rows * this.cols) / 2) {
        for (let div of this.divs) {
          div.removeEventListener("click", this.comprobarIgualdad);
        }
        let avisoVictoria = document.createElement("h3");
        this.container.after(avisoVictoria);
        let fin = Date.now();
        let tiempoSegundos = Math.floor((fin - this.inicio) / 1000);
        avisoVictoria.textContent = `HAS TERMINADO! Tiempo: ${tiempoSegundos} segundos`;
      }
    }
  };

  setEventListeners() {
    for (let div of this.divs) {
      div.addEventListener("click", this.comprobarIgualdad);
    }
  }
}

export default Game;
