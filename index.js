/**
 * Improvement: He creado un initialState para no duplicar codigo y tener una consistencia
 * en el caso de que se quiera modificar
*/

const initialState = () => [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

let state = initialState();

let currentPlayer = 'x';
let winner = null;
let xWins = 0;
let oWins = 0;

let table = document.getElementById("game-table");

// Función para rellenar el tablero según el estado del juego
/**
 * Improvement: No es recomendable insertar html en bucle, entonces he preferido crear un fragment,
 * además he pasado los for's a unos foreach
 */
function populate(state) {
  const table = document.getElementById("game-table");
  table.innerHTML = "";

  const fragment = document.createDocumentFragment();

  state.forEach((rowValues) => {
    const row = fragment.appendChild(document.createElement("tr"));

    rowValues.forEach((cellValue) => {
      const cell = row.appendChild(document.createElement("td"));
      cell.textContent = cellValue;
    });
  });

  table.appendChild(fragment);
}

// Función para determinar qué jugador debe ser el siguiente
/*Improvement: en vez de acceder en un bucle dentro de otro bucle he 
utilizado la función flat y luego filter para saber
cuantas cells son de "x" u "o" */
function nextPlayer(state) {
  const flattenState = state.flat();
  const xCount = flattenState.filter(cell => cell === 'x').length;
  const oCount = flattenState.filter(cell => cell === 'o').length;

  return xCount === oCount ? 'x' : 'o';
}

// Función para determinar si hay un ganador en el juego actual
/**
 * Improvement: En vez de chequear todas las posibilidades, cuando se ha
 * encontrado una casuistica usamos el return, tambien nos aseguramos que no sea null
 * ya que triple casilla null tambien daría la casuistica
 */
function findWinner(state) {
  // Chequear filas y columnas
  for (let i = 0; i < state.length; i++) {
    if (state[i][0] === state[i][1] && state[i][1] === state[i][2]) {
      if (state[i][0]) {
        return state[i][0];
      }
    }
    if (state[0][i] === state[1][i] && state[1][i] === state[2][i]) {
      if (state[0][i]) {
        return state[0][i];
      }
    }
  }
  
  // Chequear diagonales
  if (state[0][0] === state[1][1] && state[1][1] === state[2][2]) {
    return state[0][0];
  }
  if (state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
    return state[0][2];
  }
  return null;
}


// Rellenar el tablero según el estado del juego
populate(state);

/**
 * Improvement: Este codigo estaba repetido en varias partes de la aplicación.
 */
function repaintWins() {
  document.getElementById("x-wins").innerHTML = xWins;
  document.getElementById("o-wins").innerHTML = oWins;
}

// Añadir botón "Nuevo juego"
/**
 * Improvement: toda esta logica se ha movido a la function reset
 */
let newGameButton = document.createElement("button");
newGameButton.innerHTML = "Nuevo juego";
newGameButton.onclick = reset()

document.body.prepend(newGameButton);

/**
 * Improvement: Me he deshecho del metodo play() ya toda que la logica era duplicada excepto lo que hemos añadido en este metodo.
 */
function setWinner(winner) {
  if (winner) {
    alert(winner + " wins!");
    if (winner === 'x') {
      xWins++;
    } else {
      oWins++;
    }
    repaintWins()
  }
}

// Función para manejar el evento onClick
/**
 * Improvement: Habia dos sitios donde se añadian eventos onclick a las cells, lo he modificado para que solo sea uno
 */
function onClick() {
  if (this.innerHTML === "" && winner === null) {
    this.innerHTML = currentPlayer;
    let row = this.parentNode.rowIndex;
    let col = this.cellIndex;
    state[row][col] = currentPlayer;
    winner = findWinner(state);
    if (winner) {
      this.classList.add("winner");
      setWinner(winner);
    } else if (checkTie()) {
      alert("Tie!");
    } else {
      currentPlayer = nextPlayer(state);
      document.getElementById("next-player").innerHTML = currentPlayer;
    }
  }
}

// Función para reiniciar el juego
/**
 * Improvement, usamos la constante initialState en vez de repetir la misma matriz vacía
 */
function reset() {
  state = initialState();
  currentPlayer = 'x';
  winner = null;
  for (let i = 0; i < table.rows.length; i++) {
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      table.rows[i].cells[j].innerHTML = "";
      table.rows[i].cells[j].classList.remove("winner");
    }
  }
  document.getElementById("next-player").innerHTML = currentPlayer;
}

// Función para determinar si hay un empate
/**
 * Improvement: realmente no hay que recorrer todas las cells y usar un condicional a cada una para asegurarse que
 * no hay ninguna "null", con la funcion every podemos asegurarnos que todas cumplen la misma condicion
 */
function checkTie() {
  return state.every(row => row.every(cell => cell !== null));
}

// Añadir eventos onClick a cada casilla del tablero
for (let i = 0; i < table.rows.length; i++) {
  for (let j = 0; j < table.rows[i].cells.length; j++) {
    table.rows[i].cells[j].onclick = onClick;
  }
}

// Añadir evento onClick al botón "Nuevo juego"
newGameButton.onclick = reset;
