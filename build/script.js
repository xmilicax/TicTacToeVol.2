// script check
console.log("success");

// GLOBAL VAR
let currentPlayer = 'X'; 
let movesX = []; 
let movesO = []; 
let gameCounter = 0;
let spamCount = 0;
let wonX = 0;
let wonO = 0;

// DATE
document.addEventListener('DOMContentLoaded', function () {
  const currentYearElement = document.getElementById("year");
  currentYearElement.textContent = new Date().getFullYear() + '.';

  scoreDisplay(wonX, wonO);
});

// CLOSE THE WELCOME OVERLAY
document.addEventListener('click', function (event) {
  const begin = document.getElementById("begin");
  const overlay = document.getElementById("welcome-overlay");

  // Ensures overlay only closes when clicked directly
  if (begin && event.target === begin) {
    overlay.style.display = "none";}
});

// GAME
const cells = document.querySelectorAll('#board > div');

// event listeners for cells
cells.forEach((cell) => {
  // hovering the icon
  cell.addEventListener('mouseenter', (event) => {
    if (!event.currentTarget.querySelector('img')) {
      event.currentTarget.innerHTML= createSymbol(currentPlayer);

      let svg = event.currentTarget.querySelector('img');
      svg.style.opacity = '0.3';
    }
  }); 

  cell.addEventListener('mouseleave', (event) => {
    let svg = event.currentTarget.querySelector('img');
    if (svg.style.opacity === '0.3') {
      svg.remove();
    }
  });

  //click
  cell.addEventListener('click', move);
});

// check if the cell is available for the input
function isEmpty (cell) {
  let currentCell = cell.querySelector('img')
  // if the cell only hovers the svg, then it is empty

  return currentCell.style.opacity === '0.3';
}

function move(event) {
  const cell = event.currentTarget;
  const message = document.getElementById("message");

  // check if there is an error message from previous move
  if (message.textContent) {
    message.textContent = '';
    message.classList.remove("bg-red-300");
  }

  // check if the cell is already occupied, if so does nothing
  if (!isEmpty(cell)) { 
    spamCount++;
    message.classList.add("bg-red-300");

    if (spamCount < 5)
      message.textContent = "Nice try, but that field is not empty, try again :)";
    if (spamCount >= 5)
      message.textContent = "Ha-ha, not funny, that field is really not empty :')";
    if (spamCount > 10)
      message.textContent = "Okay it's enough now. Choose and empty field.";
    if (spamCount >= 15)
      message.innerHTML= "<a href='https://www.youtube.com/watch?v=emh7-VQ4VqI'>Click here.</a>";

    //console.log('Cell is already occupied!'); 
    //console.log(spamCount)

    return; 
  }

  // placing the player's mark
  const svgIcon = createSymbol(currentPlayer);
  cell.innerHTML = svgIcon; 
  
  // tracking the player's moves
  if (currentPlayer === 'X') {
    movesX.push(cell); 
    if (movesX.length > 3) removeOldestMove(movesX); 
    if (movesX.length === 3) dimOldestMove(movesX[0]); 
  } 
  if (currentPlayer === 'O') {
    movesO.push(cell); 
    if (movesO.length > 3) removeOldestMove(movesO); 
    if (movesO.length === 3) dimOldestMove(movesO[0]); 
  }

  // checking if there is a winner after the move
  setTimeout(() => {
    if (checkWinner(currentPlayer)) {
      alert(`${currentPlayer} wins!`);

      gameCounter++;
      if (currentPlayer === 'X')
        wonX++
      else 
        wonO++

      scoreDisplay(wonX, wonO)

      resetBoard();
      return;
    }
    // switching players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('turn').innerText = `Player ${currentPlayer} turn`; 
  }, 100);
}

// create player icon
function createSymbol(player) {
  return `<img src="./css/img/icon-${player}-bl.svg" class="w-14 h-14 object-contain mx-2" alt="${player}" />`;
}

function scoreDisplay(wonX, wonO) {
  const score = document.getElementById("score");
  score.innerHTML = createSymbol('X') +
                    `<span class="self-center"> ${wonX} : ${wonO} </span>` + 
                    createSymbol('O');  
}

// dimming the oldest move (FIFO)
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

function colorWinner() {}

// DISPLAY RESULTS

// GAME RESET
function resetBoard() {
  cells.forEach((cell) => (cell.innerHTML = ''));
  movesX = [];
  movesO = [];
  spamCount = 0;

  // every game begins with different player
  if (gameCounter % 2 === 0)
    currentPlayer = 'X';
  else
    currentPlayer = 'O';
  document.getElementById('turn').innerText = `Player ${currentPlayer} turn`; 
}
