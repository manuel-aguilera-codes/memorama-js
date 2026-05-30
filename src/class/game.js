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
    this.paresAbiertos = 0;
    this.inicio = null;
    this.createBoxes();
    this.paintBoxes();
    this.divs = document.querySelectorAll("#game .box");
    this.bloqueado = false;
    this.tarjeta1 = null;
    this.tarjeta2 = null;

    this.setEventListeners();
  }

  createRandomColors() {
    //Creamos array con cantidad de colores (string)  aleatorios igual a la mitad de cartas totales
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
    // Si hay datos en localStorage, se usan para crear las boxes
    let box;
    if (localStorage.getItem("boxes") !== null) {
      let boxesFromLocalStorage = JSON.parse(localStorage.getItem("boxes"));
      boxesFromLocalStorage.map((thisBox) => {
        box = new Box(thisBox.color);
        box.isMatched = thisBox.isMatched;
        this.boxes.push(box);
      });
    } else {
      // Creamos array de objetos de clase Box desde cero
      let index = 0;
      let arrayColors = this.createRandomColors();

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          box = new Box(arrayColors[index]);
          index++;
          this.boxes.push(box);
        }
      }
    }

    if (localStorage.getItem("timeSoFar") !== null) {
      this.inicio = Date.now() - parseInt(localStorage.getItem("timeSoFar"));
    }

    if (localStorage.getItem("paresAbiertos") !== null) {
      this.paresAbiertos = parseInt(localStorage.getItem("paresAbiertos"));
    }

    this.saveArrayBoxesInLocalStorage();
  }

  saveArrayBoxesInLocalStorage() {
    let arrayBoxesForLocalStorage = this.boxes.map((box) => {
      return {
        color: box.color,
        isMatched: box.isMatched,
      };
    });
    localStorage.setItem("boxes", JSON.stringify(arrayBoxesForLocalStorage));
    localStorage.setItem("timeSoFar", Date.now() - this.inicio);
    localStorage.setItem("paresAbiertos", this.paresAbiertos);
  }

  paintBoxes() {
    this.setGridTemplate();
    this.boxes.forEach((box, index) => {
      let newBoxDiv = document.createElement("div");
      newBoxDiv.classList.add("box");
      newBoxDiv.dataset.color = box.color;
      newBoxDiv.dataset.index = index;
      if (box.isMatched === true) {
        newBoxDiv.style.backgroundColor = box.color;
      }
      this.container.append(newBoxDiv);
    });
  }

  setGridTemplate() {
    this.container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
  }

  static askUserSize() {
    let rows;
    let cols;

    if (
      localStorage.getItem("rows") !== null &&
      localStorage.getItem("cols") !== null
    ) {
      rows = parseInt(localStorage.getItem("rows"));
      cols = parseInt(localStorage.getItem("cols"));
    } else {
      rows = prompt("Introduzca el número de filas");
      cols = prompt("Introduzca número de columnas");

      while ((rows * cols) % 2 !== 0) {
        rows = prompt(
          "Introduzca el número de filas nuevamente, el número de cartas debe ser par",
        );
        cols = prompt(
          "Introduzca número de columnas nuevamente, el número de cartas debe ser par",
        );
      }

      localStorage.setItem("rows", rows);
      localStorage.setItem("cols", cols);
    }

    return {
      rows: rows,
      cols: cols,
    };
  }

  static resetGame() {
    localStorage.removeItem("rows");
    localStorage.removeItem("cols");
    localStorage.removeItem("boxes");
    localStorage.removeItem("timeSoFar");
    localStorage.removeItem("paresAbiertos");
    location.reload();
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
        this.paresAbiertos = this.paresAbiertos + 1;
        this.boxes[parseInt(this.tarjeta1.dataset.index)].isMatched = true;
        this.boxes[parseInt(this.tarjeta2.dataset.index)].isMatched = true;
        this.saveArrayBoxesInLocalStorage();
        this.tarjeta1 = null;
        this.tarjeta2 = null;
        this.bloqueado = false;
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
