/**
 * Conway's Game of Life
 *
 * Original concept and rules: John Horton Conway
 * JavaScript/p5.js implementation: @rishabkgautam
 *
 * The grid fills the whole window. The cell size is picked so that
 * about 32 cells fit along the shorter side of the screen, and the
 * number of rows and columns follows from the window size.
 *
 * Living cells are displayed in green. To change the color, modify
 * the `stroke()` value under the "living cells" section in draw().
 */


const cellsOnShortSide = 32;

let matrixRows, matrixColumns;
let cellWidth, cellHeight;
let matrix;


// Randomly initialize the matrix.
// Each cell has a 10% chance of being alive and a 90% chance of being dead.
function createRandomGrid(rows, columns, livingProbability = 0.1) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () =>
      Math.random() < 1 - livingProbability ? 0 : 1
    )
  );
}


// Work out the grid size from the window size.
// The matrix is only rebuilt when the number of rows or columns changes.
function buildGrid() {
  const cellSize = Math.max(
    4,
    Math.floor(Math.min(windowWidth, windowHeight) / cellsOnShortSide)
  );
  const columns = Math.floor(windowWidth / cellSize);
  const rows = Math.floor(windowHeight / cellSize);

  cellWidth = windowWidth / columns;
  cellHeight = windowHeight / rows;

  if (columns !== matrixColumns || rows !== matrixRows) {
    matrixColumns = columns;
    matrixRows = rows;
    matrix = createRandomGrid(rows, columns);
  }
}

// The function to compute the next state
function nextState(matrix, matrixColumns, matrixRows) {
  const newMatrix = Array.from(
    { length: matrixRows },
    () => Array(matrixColumns).fill(0)
  );

  const xAdjacents = [-1, 1, 0];
  const yAdjacents = [-1, 1, 0];

  for (let matrixY = 0; matrixY < matrixRows; matrixY++) {
    for (let matrixX = 0; matrixX < matrixColumns; matrixX++) {
      let currentAdjacentSquaresSum = 0;

      // Check neighboring cells
      for (const leverY of yAdjacents) {
        for (const leverX of xAdjacents) {
          const adjacentX = matrixX + leverX;
          const adjacentY = matrixY + leverY;

          if (
            adjacentX >= 0 &&
            adjacentX < matrixColumns &&
            adjacentY >= 0 &&
            adjacentY < matrixRows &&
            !(leverX === 0 && leverY === 0)
          ) {
            currentAdjacentSquaresSum += matrix[adjacentY][adjacentX];
          }
        }
      }

      // Calculate the cell's next value
      if (currentAdjacentSquaresSum === 3) {
        newMatrix[matrixY][matrixX] = 1;
      } else if (currentAdjacentSquaresSum === 2) {
        newMatrix[matrixY][matrixX] = matrix[matrixY][matrixX];
      } else {
        newMatrix[matrixY][matrixX] = 0;
      }
    }
  }

  return newMatrix;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildGrid();
  frameRate(10);
  //describe("Implementation of Conway's Game of Life");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildGrid();
}

function draw() {
  // Background Color
  background(0);

  // grid lines
  stroke('white');
  strokeWeight(1);

  for (let col = 0; col <= matrixColumns; col++) {
    const x = col * cellWidth;
    line(x, 0, x, height);
  }

  for (let row = 0; row <= matrixRows; row++) {
    const y = row * cellHeight;
    line(0, y, width, y);
  }

  // living cells
  stroke('green');
  strokeWeight(Math.min(cellWidth, cellHeight) * 0.6);

  for (let row = 0; row < matrixRows; row++) {
    for (let col = 0; col < matrixColumns; col++) {
      if (matrix[row][col] === 1) {
        point(
          col * cellWidth + cellWidth / 2,
          row * cellHeight + cellHeight / 2
        );
      }
    }
  }

  // make current state equal to next state
  matrix = nextState(matrix, matrixColumns, matrixRows);

}
