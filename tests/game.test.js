import test from "node:test";
import assert from "node:assert/strict";

import {
  canMoveTile,
  createShuffledBoard,
  findEmptyIndex,
  getMovableTileIndices,
  isSolved,
  moveTile
} from "../src/game.js";

const solvedBoard = [
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 12,
  13, 14, 15, 0
];

function isSolvable(board) {
  const numbers = board.filter((value) => value !== 0);
  let inversions = 0;

  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      if (numbers[i] > numbers[j]) inversions += 1;
    }
  }

  const blankRowFromBottom = 4 - Math.floor(findEmptyIndex(board) / 4);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

test("rozpozná vyriešenú a nevyriešenú plochu", () => {
  assert.equal(isSolved(solvedBoard), true);
  assert.equal(isSolved([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0]), false);
  assert.equal(isSolved([1, 2, 3]), false);
});

test("nájde prázdne políčko a povolené susedné ťahy", () => {
  assert.equal(findEmptyIndex(solvedBoard), 15);
  assert.deepEqual(getMovableTileIndices(solvedBoard), [11, 14]);
  assert.equal(canMoveTile(solvedBoard, 11), true);
  assert.equal(canMoveTile(solvedBoard, 14), true);
  assert.equal(canMoveTile(solvedBoard, 10), false);
  assert.equal(canMoveTile(solvedBoard, 15), false);
});

test("nepovažuje okraj riadka za susedné políčko v ďalšom riadku", () => {
  const board = [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  assert.equal(canMoveTile(board, 4), false);
  assert.deepEqual(getMovableTileIndices(board), [7, 2]);
});

test("vykoná platný ťah bez zmeny pôvodného poľa", () => {
  const nextBoard = moveTile(solvedBoard, 14);

  assert.notEqual(nextBoard, solvedBoard);
  assert.deepEqual(solvedBoard, [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0
  ]);
  assert.deepEqual(nextBoard, [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15
  ]);
  assert.equal(isSolved(nextBoard), false);
});

test("neplatný ťah nič nezmení", () => {
  assert.equal(moveTile(solvedBoard, 10), null);
  assert.equal(moveTile(solvedBoard, 15), null);
  assert.equal(moveTile(solvedBoard, -1), null);
  assert.equal(moveTile(solvedBoard, 16), null);
});

test("premiešanie vytvorí úplnú, riešiteľnú a nie vyriešenú hru", () => {
  const board = createShuffledBoard(() => 0.5, 240);

  assert.equal(board.length, 16);
  assert.deepEqual([...board].sort((a, b) => a - b), [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  ]);
  assert.equal(isSolvable(board), true);
  assert.equal(isSolved(board), false);
});

test("každá náhodná hra je riešiteľná", () => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const board = createShuffledBoard();
    assert.equal(isSolvable(board), true);
    assert.equal(isSolved(board), false);
  }
});

test("odmietne neplatný počet krokov premiešania", () => {
  assert.throws(() => createShuffledBoard(Math.random, 0), RangeError);
  assert.throws(() => createShuffledBoard(Math.random, 1.5), RangeError);
});

test("odmietne neplatný zdroj náhodných čísel", () => {
  assert.throws(() => createShuffledBoard(() => 1, 10), RangeError);
});
