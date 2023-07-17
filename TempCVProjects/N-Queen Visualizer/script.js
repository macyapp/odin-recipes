let boardSize = 8;
let solutions = [];
let intervalId;
let currentSolutionIndex = 0;

function startVisualization() {
  const nInput = document.getElementById("n");
  boardSize = parseInt(nInput.value, 10);

  solutions = [];
  currentSolutionIndex = 0;
  backtrack([], 0);
  visualizeSolutions();
  intervalId = setInterval(showNextSolution, 1000);
  disableButtons();
}

function pauseResumeVisualization() {
  const pauseResumeButton = document.querySelector("button:nth-child(2)");
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    pauseResumeButton.textContent = "Resume";
  } else {
    intervalId = setInterval(showNextSolution, 1000);
    pauseResumeButton.textContent = "Pause";
  }
}

function stopVisualization() {
  clearInterval(intervalId);
  intervalId = null;
  currentSolutionIndex = 0;
  visualizeSolutions();
  enableButtons();
}

function showNextSolution() {
  currentSolutionIndex++;
  if (currentSolutionIndex >= solutions.length) {
    stopVisualization();
  } else {
    visualizeSolutions();
  }
}

function visualizeSolutions() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  const currentSolution = solutions[currentSolutionIndex];
  for (let row = 0; row < boardSize; row++) {
    const boardRow = document.createElement("div");
    boardRow.className = "board-row";

    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (currentSolution[col] === row) {
        cell.classList.add("queen");
      }
      boardRow.appendChild(cell);
    }

    board.appendChild(boardRow);
  }
}

function disableButtons() {
  document.getElementById("n").disabled = true;
  document.querySelector("button:nth-child(1)").disabled = true;
}

function enableButtons() {
  document.getElementById("n").disabled = false;
  document.querySelector("button:nth-child(1)").disabled = false;
  document.querySelector("button:nth-child(2)").textContent = "Pause/Resume";
}

function isValidMove(solution, row, col) {
  for (let i = 0; i < row; i++) {
    if (solution[i] === col || Math.abs(solution[i] - col) === Math.abs(i - row)) {
      return false;
    }
  }
  return true;
}

function backtrack(currentSolution, row) {
  if (row === boardSize) {
    solutions.push([...currentSolution]);
    return;
  }

  for (let col = 0; col < boardSize; col++) {
    if (isValidMove(currentSolution, row, col)) {
      currentSolution.push(col);
      backtrack(currentSolution, row + 1);
      currentSolution.pop();
    }
  }
}
