// --- dice-game-ui.js ---
import { ensureMinimumPlayers, addPlayer, deleteNewestPlayer, } from './PLayer.js';
import { moveToNextPlayer, highlightCurrentPlayerAndRound} from './Dice-Game-logic.js';

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




// Game State (using an object instead of exporting variables)
const gameState = {
    currentPlayer: 1,
    currentRound: 1,
    rollsLeft: 3,
    selectedDice: [],
    gameStarted: false,
};

addPlayerBtn.disabled = false;
deletePlayerBtn.disabled = false;

// Event Listeners
nextPlayerBtn.addEventListener('click', moveToNextPlayer);

// Utility
const getRandomDiceNumber = () => Math.floor(Math.random() * 6) + 1;

// Roll Dice
function rollDice() {
  if (!gameState.gameStarted) {
    gameState.gameStarted = true;
    addPlayerBtn.disabled = true;
    deletePlayerBtn.disabled = true;
  }

  if (gameState.rollsLeft === 0) {
    alert(`Player ${gameState.currentPlayer} has no rolls left!`);
    return;
  }

  diceImages.forEach((dice, index) => {
    if (!gameState.selectedDice.includes(index)) {
      const value = getRandomDiceNumber();
      dice.src = `Terninger/${value}.JPG`;
      dice.alt = `Dice showing ${value}`;
      dice.dataset.value = value;
    }
  });

  gameState.rollsLeft--;
}

function submitScore() {
  calculateScoreForCurrentRound();
  moveToNextPlayer();
}

// Dice selection
function toggleDiceSelection(e) {
  const dice = e.target;
  const index = [...diceImages].indexOf(dice);

  if (gameState.selectedDice.includes(index)) {
    gameState.selectedDice = gameState.selectedDice.filter(i => i !== index);
    dice.style.border = 'none';
  } else {
    gameState.selectedDice.push(index);
    dice.style.border = '2px solid #0f7a0f';
  }
}

// Reset Game
function resetGame() {
    gameState.gameStarted = false;
    gameState.currentPlayer = 1;
    gameState.currentRound = 1;
    gameState.rollsLeft = 3;
    gameState.selectedDice = [];

    playerNamesContainer.innerHTML = '';
    scoreTbody.querySelectorAll('td.player-score-cell').forEach(cell => (cell.textContent = ''));

    if (restartButton) restartButton.remove();

    addPlayerBtn.disabled = false;
    deletePlayerBtn.disabled = false;

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
restartButton.addEventListener('click', resetGame);

export { gameState, resetGame, diceImages, highlightCurrentPlayerAndRound};
export function setCurrentPlayer(newPlayer) {
    gameState.currentPlayer = newPlayer;
}
