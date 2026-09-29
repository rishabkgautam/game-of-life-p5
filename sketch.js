/**
 * Conway's Game of Life
 *
 * Original concept and rules: John Horton Conway
 * JavaScript/p5.js implementation: @rishabkgautam
 *
 * The game area is 765 × 544 pixels.
 * Each cell is 17 × 17 pixels, creating a 45 × 32 cell matrix.
 *
 * Living cells are displayed in green with a 10-pixel stroke width.
 * To change the living-cell color, modify the `stroke()` value
 * under the "Draw current state" section.
 */


// Randomly initialize the matrix.
// Each cell has a 10% chance of being alive and a 90% chance of being dead.
function createMatrix(rows, columns, livingProbability = 0.1) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () =>
      Math.random() < 1 - livingProbability ? 0 : 1
    )
  );
}


// Matrix variables

const matrix_leftX = 300, matrix_topY = 100;
const matrix_Width = 765, matrix_Height = 544;
const matrixSquareWidth = 17;
const matrixRows = Math.floor(matrix_Height / matrixSquareWidth);
const matrixColumns = Math.floor(matrix_Width / matrixSquareWidth);

// Creating matrix to hold the 0's or 1's for each matrix cell
let matrix = createMatrix(matrixRows, matrixColumns);

// Point (life cells) variables

let pointLeftX = matrix_leftX + matrixSquareWidth / 2;
let pointTopY = matrix_topY + matrixSquareWidth / 2;

// The function to compute the next state

function nextState(matrix, matrixColumns, matrixRows) {
  const nextState = Array.from(
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
        nextState[matrixY][matrixX] = 1;
      } else if (currentAdjacentSquaresSum === 2) {
        nextState[matrixY][matrixX] = matrix[matrixY][matrixX];
      } else {
        nextState[matrixY][matrixX] = 0;
      }
    }
  }

  return nextState;
}


// The update matrix function to updates the values from nextState function
let next;

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(10);
  //describe("Implementation of Conway's Game of Life");
}

function draw() {

  // Background Color
  background(0);


  // vertical lines
  stroke('white');
  strokeWeight(1);

  for(let lineX = 0; lineX <= matrix_Width; lineX += matrixSquareWidth){
    line(matrix_leftX + lineX, matrix_topY, matrix_leftX + lineX, matrix_topY+ matrix_Height);
  }

  for(let lineY = 0; lineY <= matrix_Height; lineY += matrixSquareWidth){
    line(matrix_leftX, matrix_topY + lineY, matrix_leftX + matrix_Width, matrix_topY + lineY);
  }

  // Define the draw current state function

  for (let pointsX = pointLeftX; pointsX < matrix_leftX + matrix_Width; pointsX += matrixSquareWidth) {
    for (let pointsY = pointTopY; pointsY < matrix_topY + matrix_Height; pointsY += matrixSquareWidth) {

      const pointMatrixRow = (pointsX - pointLeftX) / 17;
      const pointMatrixColumn = (pointsY - pointTopY) / 17;


      if (matrix[pointMatrixColumn][pointMatrixRow] === 1) {

        stroke('green');
        strokeWeight(10);
        point(pointsX, pointsY);
      }
    }
  }


  // make current state equal to next state
  next = nextState(matrix, matrixColumns, matrixRows);

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      matrix[row][column] = next[row][column];
    }
  }

}
