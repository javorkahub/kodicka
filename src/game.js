export const BOARD_SIZE = 4;
export const BOARD_LENGTH = BOARD_SIZE * BOARD_SIZE;

export function findEmptyIndex(board) {
  return Array.isArray(board) ? board.indexOf(0) : -1;
}

export function canMoveTile(board, tileIndex) {
  if (!Array.isArray(board) || board.length !== BOARD_LENGTH) return false;
  if (!Number.isInteger(tileIndex) || tileIndex < 0 || tileIndex >= BOARD_LENGTH) return false;

  const emptyIndex = findEmptyIndex(board);
  if (emptyIndex < 0 || emptyIndex === tileIndex) return false;

  const tileRow = Math.floor(tileIndex / BOARD_SIZE);
  const tileColumn = tileIndex % BOARD_SIZE;
  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);
  const emptyColumn = emptyIndex % BOARD_SIZE;

  return (
    (tileRow === emptyRow && Math.abs(tileColumn - emptyColumn) === 1) ||
    (tileColumn === emptyColumn && Math.abs(tileRow - emptyRow) === 1)
  );
}

export function moveTile(board, tileIndex) {
  if (!canMoveTile(board, tileIndex)) return null;

  const nextBoard = board.slice();
  const emptyIndex = findEmptyIndex(nextBoard);
  [nextBoard[emptyIndex], nextBoard[tileIndex]] = [
    nextBoard[tileIndex],
    nextBoard[emptyIndex]
  ];

  return nextBoard;
}

export function getMovableTileIndices(board) {
  const emptyIndex = findEmptyIndex(board);
  if (emptyIndex < 0 || board.length !== BOARD_LENGTH) return [];

  const row = Math.floor(emptyIndex / BOARD_SIZE);
  const column = emptyIndex % BOARD_SIZE;
  const candidates = [];

  if (row > 0) candidates.push(emptyIndex - BOARD_SIZE);
  if (row < BOARD_SIZE - 1) candidates.push(emptyIndex + BOARD_SIZE);
  if (column > 0) candidates.push(emptyIndex - 1);
  if (column < BOARD_SIZE - 1) candidates.push(emptyIndex + 1);

  return candidates;
}

export function isSolved(board) {
  if (!Array.isArray(board) || board.length !== BOARD_LENGTH) return false;

  for (let index = 0; index < BOARD_LENGTH - 1; index += 1) {
    if (board[index] !== index + 1) return false;
  }

  return board[BOARD_LENGTH - 1] === 0;
}

export function createShuffledBoard(random = Math.random, steps = 240) {
  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError("Počet premiešavacích krokov musí byť kladné celé číslo.");
  }

  const board = Array.from({ length: BOARD_LENGTH - 1 }, (_, index) => index + 1);
  board.push(0);

  let previousEmptyIndex = -1;

  for (let step = 0; step < steps; step += 1) {
    let choices = getMovableTileIndices(board);

    // Nevytváraj zbytočný okamžitý návrat na predchádzajúcu pozíciu.
    if (previousEmptyIndex !== -1 && choices.length > 1) {
      choices = choices.filter((index) => index !== previousEmptyIndex);
    }

    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError("Generátor náhodných čísel musí vracať hodnotu od 0 do 1.");
    }

    const selected = Math.floor(sample * choices.length);
    const emptyIndex = findEmptyIndex(board);
    const tileIndex = choices[selected];

    [board[emptyIndex], board[tileIndex]] = [board[tileIndex], board[emptyIndex]];
    previousEmptyIndex = emptyIndex;
  }

  // Hráč nikdy nezačne už vyriešenou alebo neplatnou konfiguráciou.
  if (isSolved(board)) {
    [board[BOARD_LENGTH - 2], board[BOARD_LENGTH - 1]] = [
      board[BOARD_LENGTH - 1],
      board[BOARD_LENGTH - 2]
    ];
  }

  return board;
}
