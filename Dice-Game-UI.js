// --- dice-game-ui.js ---
import { playerCount, ensureMinimumPlayers, addPlayer, deleteNewestPlayer } from './Player.js';
import { moveToNextPlayer, checkIfGameFinished } from './Dice-Game-logic.js';
// DOM Elements
const rollDiceButton = document.getElementById('roll-btn');
const nextPlayerButton = document.getElementById('next-player-btn');
const diceImages = document.querySelectorAll('.dice');
const scoreTable = document.getElementById('score-table');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const restartButton = document.getElementById('restart-game-btn');
const nextPlayerBtn = document.getElementById('next-player-btn');
const playerNamesContainer = document.getElementById('player-names-container');
const scoreTbody = document.getElementById('score-tbody');

// Game State
let currentPlayer = 1;
let currentRound = 1;
let rollsLeft = 3;
let selectedDice = [];
let gameStarted = false;
addPlayerBtn.disabled = false;
deletePlayerBtn.disabled = false;

// Event Listeners
nextPlayerBtn.addEventListener('click', nextPlayer);

// Utility
const getRandomDiceNumber = () => Math.floor(Math.random() * 6) + 1;


// Roll Dice
function rollDice() {
  if (!gameStarted) {
    gameStarted = true;
    addPlayerBtn.disabled = true;
    deletePlayerBtn.disabled = true;
  }

  if (rollsLeft === 0) {
    alert(`Player ${currentPlayer} has no rolls left!`);
    return;
  }

  diceImages.forEach((dice, index) => {
    if (!selectedDice.includes(index)) {
      const value = getRandomDiceNumber();
      dice.src = `Terninger/${value}.JPG`;
      dice.alt = `Dice showing ${value}`;
      dice.dataset.value = value;
    }
  });

  rollsLeft--;
}

function submitScore() {
  calculateScoreForCurrentRound();
  moveToNextPlayer();
}

// Dice selection
function toggleDiceSelection(e) {
  const dice = e.target;
  const index = [...diceImages].indexOf(dice);

  if (selectedDice.includes(index)) {
    selectedDice = selectedDice.filter(i => i !== index);
    dice.style.border = 'none';
  } else {
    selectedDice.push(index);
    dice.style.border = '2px solid #0f7a0f';
  }
}

//highlight current player and round
function highlightCurrentPlayerAndRound() {
  // Remove existing highlights
  const allCells = scoreTbody.querySelectorAll('td');
  const allRows = scoreTbody.querySelectorAll('tr');

  allCells.forEach(cell => cell.classList.remove('current-player-column'));
  allRows.forEach(row => row.classList.remove('current-round-row'));

  // Highlight the current round
  const roundRow = scoreTbody.querySelector(`tr:nth-child(${currentRound})`);
  if (roundRow) roundRow.classList.add('current-round-row');

  // Highlight the current player's column
  const columnCells = scoreTbody.querySelectorAll(`.player-${currentPlayer}-cell`);
  columnCells.forEach(cell => cell.classList.add('current-player-column'));
}
// Reset
function resetGame() {
    gameStarted = false;
    currentPlayer = 1;
    currentRound = 1;
    rollsLeft = 3;
    selectedDice = [];

    playerNamesContainer.innerHTML = ''; // Clear player names
    scoreTbody.querySelectorAll('td.player-score-cell').forEach(cell => (cell.textContent = ''));

    if (restartButton) restartButton.remove();

    addPlayerBtn.disabled = false;
    deletePlayerBtn.disabled = false;

    // Ensure at least one player is added after reset
    ensureMinimumPlayers();

    diceImages.forEach((dice, index) => {
        const value = index + 1;
        dice.src = `Terninger/${value}.JPG`;
        dice.alt = `Dice showing ${value}`;
        dice.style.border = 'none';
        dice.dataset.value = value.toString();
    });

    highlightCurrentPlayerAndRound();
}

// Event Listeners
rollDiceButton.addEventListener('click', rollDice);
diceImages.forEach(dice => dice.addEventListener('click', toggleDiceSelection));
document.addEventListener('DOMContentLoaded', highlightCurrentPlayerAndRound);
addPlayerBtn.addEventListener('click', addPlayer);
deletePlayerBtn.addEventListener('click', deleteNewestPlayer);

export { gameStarted, restartButton, resetGame, currentPlayer, currentRound, rollsLeft, selectedDice, diceImages };