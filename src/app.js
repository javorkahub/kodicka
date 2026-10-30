import {
  canMoveTile,
  createShuffledBoard,
  findEmptyIndex,
  isSolved,
  moveTile
} from "./game.js";

const boardElement = document.querySelector("#board");
const movesElement = document.querySelector("#moves");
const timerElement = document.querySelector("#timer");
const statusElement = document.querySelector("#game-status");
const newGameButton = document.querySelector("#new-game");
const restartButton = document.querySelector("#restart");

const state = {
  board: createShuffledBoard(),
  initialBoard: [],
  moves: 0,
  seconds: 0,
  timerId: null,
  hasStarted: false,
  isWon: false
};

state.initialBoard = state.board.slice();

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function renderStats() {
  movesElement.textContent = String(state.moves);
  timerElement.textContent = formatTime(state.seconds);
}

function setStatus(message, isWin = false) {
  statusElement.classList.toggle("is-win", isWin);
  statusElement.querySelector("span:last-child").textContent = message;
}

function renderBoard() {
  const fragment = document.createDocumentFragment();

  state.board.forEach((value, index) => {
    if (value === 0) {
      const emptySlot = document.createElement("div");
      emptySlot.className = "empty-slot";
      emptySlot.setAttribute("aria-label", "Prázdne políčko");
      emptySlot.setAttribute("aria-hidden", "true");
      fragment.append(emptySlot);
      return;
    }

    const tile = document.createElement("button");
    const movable = canMoveTile(state.board, index);

    tile.type = "button";
    tile.className = "tile";
    tile.textContent = String(value);
    tile.dataset.index = String(index);
    tile.disabled = state.isWon || !movable;
    tile.setAttribute(
      "aria-label",
      "Políčko " + value + (movable ? ", presunúť do prázdneho miesta" : "")
    );
    tile.addEventListener("click", () => makeMove(index));
    fragment.append(tile);
  });

  boardElement.replaceChildren(fragment);
  boardElement.setAttribute("aria-label", state.isWon
    ? "Vyriešená hracia plocha"
    : "Hracia plocha s číslami od 1 do 15");
}

function render() {
  renderBoard();
  renderStats();
}

function stopTimer() {
  if (state.timerId !== null) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  if (state.hasStarted || state.isWon) return;

  state.hasStarted = true;
  state.timerId = window.setInterval(() => {
    state.seconds += 1;
    renderStats();
  }, 1000);
}

function makeMove(tileIndex) {
  if (state.isWon) return;

  const nextBoard = moveTile(state.board, tileIndex);
  if (nextBoard === null) return;

  startTimer();
  state.board = nextBoard;
  state.moves += 1;

  if (isSolved(state.board)) {
    state.isWon = true;
    stopTimer();
    setStatus(
      "Výborne! Vyriešil si hlavolam za " + state.moves +
      (state.moves === 1 ? " ťah." : state.moves < 5 ? " ťahy." : " ťahov."),
      true
    );
  } else {
    setStatus("Dobrý ťah. Pokračuj, riešenie je na dosah.");
  }

  render();
}

function startNewGame() {
  stopTimer();
  state.board = createShuffledBoard();
  state.initialBoard = state.board.slice();
  state.moves = 0;
  state.seconds = 0;
  state.hasStarted = false;
  state.isWon = false;

  setStatus("Nová hra je pripravená. Veľa šťastia!");
  render();
}

function restartGame() {
  stopTimer();
  state.board = state.initialBoard.slice();
  state.moves = 0;
  state.seconds = 0;
  state.hasStarted = false;
  state.isWon = false;

  setStatus("Rozloženie je späť na začiatku. Skús to znova!");
  render();
}

function handleKeyboard(event) {
  const offsets = {
    ArrowUp: -4,
    ArrowDown: 4,
    ArrowLeft: -1,
    ArrowRight: 1
  };

  if (!Object.prototype.hasOwnProperty.call(offsets, event.key)) return;

  event.preventDefault();

  if (state.isWon) return;

  const emptyIndex = findEmptyIndex(state.board);
  const emptyColumn = emptyIndex % 4;

  if (event.key === "ArrowLeft" && emptyColumn === 0) return;
  if (event.key === "ArrowRight" && emptyColumn === 3) return;

  makeMove(emptyIndex + offsets[event.key]);
}

newGameButton.addEventListener("click", startNewGame);
restartButton.addEventListener("click", restartGame);
document.addEventListener("keydown", handleKeyboard);

render();
