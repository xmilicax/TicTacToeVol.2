// DATE
document.addEventListener('DOMContentLoaded', function () {
  const currentYearElement = document.getElementById("year");
  currentYearElement.textContent = new Date().getFullYear() + '.';
});

// CLOSE THE WELCOME OVERLAY
document.addEventListener('click', function (event) {
  const begin = document.getElementById("welcome-overlay");
  if (begin && event.target === begin) // Ensure overlay only closes when clicked directly
    begin.style.display = "none";
});

// GAME
// GLOBAL VAR
let currentPlayer = 'X'; 
let movesX = []; 
let movesO = []; 
let gameCounter = 0;

const cells = document.querySelectorAll('#board > div');

// event listeners for cells
cells.forEach((cell) => {
  cell.addEventListener('click', move);
});

function move(event) {
  const cell = event.currentTarget;

  // check if the cell is already occupied, if so does nothing
  if (cell.querySelector('img')) { 
    console.log('Cell already occupied!'); 
    return; 
  }

  // placing the player's mark
  const svgIcon = createIcon(currentPlayer);
  cell.innerHTML = svgIcon; 
  //console.log(`${currentPlayer} players mark`);

  // tracking the player's moves
  if (currentPlayer === 'X') {
    movesX.push(cell); 
    if (movesX.length > 3) removeOldestMove(movesX); 
    if (movesX.length === 3) dimOldestMove(movesX[0]); 
  } else {
    movesO.push(cell); 
    if (movesO.length > 3) removeOldestMove(movesO); 
    if (movesO.length === 3) dimOldestMove(movesO[0]); 
  }

  // checking if there is a winner after the move
  setTimeout(() => {
    if (checkWinner(currentPlayer)) {
      alert(`${currentPlayer} wins!`);
      gameCounter++;
      resetBoard();
      return;
    }
    // switching players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('turn').innerText = `Player ${currentPlayer} turn`; 
  }, 100);
}

// create player icon
function createIcon(player) {
  return `<img src="./css/img/icon-${player}-bl.svg" class="w-14 h-14 object-contain" alt="${player}" />`;
}

// dim the oldest move (FIFO)
function dimOldestMove(cell) {
  const imgElement = cell.querySelector('img');
  if (imgElement && imgElement.alt === currentPlayer) {
    imgElement.style.opacity = '0.6'; 
  }
}


// removing the oldest move (FIFO)
function removeOldestMove(moves) {
  const oldestMove = moves.shift();
  oldestMove.innerHTML = ''; 
}

// winner checker
function checkWinner(player) {
  const winningCombo = [
    ['11', '12', '13'], // row 1
    ['21', '22', '23'], // row 2
    ['31', '32', '33'], // row 3
    ['11', '21', '31'], // col 1
    ['12', '22', '32'], // col 2
    ['13', '23', '33'], // col 3
    ['11', '22', '33'], // dia 1
    ['13', '22', '31'], // dia 2
  ];

  return winningCombo.some((combo) =>
    combo.every((id) => {
      const cell = document.getElementById(id);
      const img = cell.querySelector('img');
      return img && img.alt === player; 
    })
  );
}

// GAME RESET
function resetBoard() {
  cells.forEach((cell) => (cell.innerHTML = ''));
  movesX = [];
  movesO = [];

  // every game begins with different player
  if (gameCounter % 2 === 0)
    currentPlayer = 'X';
  else
    currentPlayer = 'O';
  document.getElementById('turn').innerText = `Player ${currentPlayer} turn`; 
}
