// Combined JavaScript file for Yahtzee game

// DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');
const rollDiceButton = document.getElementById('roll-btn');
const nextPlayerButton = document.getElementById('next-player-btn');
const diceImages = document.querySelectorAll('.dice');
const restartButton = document.getElementById('restart-game-btn');

// Game State
let playerCount = 0;
let currentPlayer = 0;
let currentRound = 1;
let rollsLeft = 3;
let selectedDice = [];
let gameStarted = false;
addPlayerBtn.disabled = false;
deletePlayerBtn.disabled = false;

// Utility
const getRandomDiceNumber = () => Math.floor(Math.random() * 6) + 1;

// --- Add Player ---
function addPlayer() {
    if (gameStarted) {
        alert("You cannot add players after the game has started!");
        return;
    }

    if (playerCount >= 6) return; // Limit to 6 players

    playerCount++; // Increment player count
    updatePlayerCountDisplay();

    // Player name row
    const newRow = document.createElement('tr');
    newRow.id = `player-${playerCount}`;

    const playerCell = document.createElement('td');
    playerCell.textContent = `Player ${playerCount}`;
    playerCell.className = 'player-label';

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 10;
    nameInput.value = `Player ${playerCount}`;
    nameInput.className = 'player-name-input';
    nameInput.setAttribute('aria-label', `Player ${playerCount} name`);
    nameCell.appendChild(nameInput);

    newRow.appendChild(playerCell);
    newRow.appendChild(nameCell);
    playerNamesDiv.appendChild(newRow);

    // Add score table column
    const newTh = document.createElement('th');
    newTh.textContent = nameInput.value;
    newTh.className = `player-header player-${playerCount}-header`;
    newTh.dataset.playerId = playerCount;
    scoreTableHead.appendChild(newTh);

    // Add cells to each row in score body
    const rows = scoreTbody.querySelectorAll('tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.textContent = '';
        newCell.className = `player-score-cell player-${playerCount}-cell`;
        newCell.dataset.playerId = playerCount;
        row.appendChild(newCell);
    });

    // Live update header on name change
    nameInput.addEventListener('input', () => {
        newTh.textContent = nameInput.value || `Player ${playerCount}`;
    });
}

// --- Delete Player ---
function deleteNewestPlayer() {
    if (gameStarted) {
        alert("You cannot delete players after the game has started!");
        return;
    }

    if (playerCount <= 1) return; // Prevent deleting the last player

    const playerRow = document.getElementById(`player-${playerCount}`);
    if (playerRow) playerRow.remove();

    const header = scoreTableHead.querySelector(`.player-${playerCount}-header`);
    if (header) header.remove();

    const scoreCells = scoreTbody.querySelectorAll(`.player-${playerCount}-cell`);
    scoreCells.forEach(cell => cell.remove());

    playerCount--; // Decrement player count
    updatePlayerCountDisplay();

    // Ensure at least one player remains
    ensureMinimumPlayers();
}

// --- Ensure Minimum Players ---
function ensureMinimumPlayers() {
    if (playerCount == 0) {
        addPlayer(); // Add a player if none exist
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    ensureMinimumPlayers(); // Ensure at least 1 player on load
});

addPlayerBtn.addEventListener('click', addPlayer);
deletePlayerBtn.addEventListener('click', deleteNewestPlayer);

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
  const allCells = scoreTbody.querySelectorAll('td');
  const allRows = scoreTbody.querySelectorAll('tr');

  allCells.forEach(cell => cell.classList.remove('active-player-column'));
  allRows.forEach(row => row.classList.remove('active-round-row'));

  const roundRow = scoreTbody.querySelector(`tr:nth-child(${currentRound})`);
  if (roundRow) roundRow.classList.add('active-round-row');

  const columnCells = scoreTbody.querySelectorAll(`.player-${currentPlayer}-cell`);
  columnCells.forEach(cell => cell.classList.add('active-player-column'));
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

rollDiceButton.addEventListener('click', rollDice);
nextPlayerButton.addEventListener('click', moveToNextPlayer);
diceImages.forEach(dice => dice.addEventListener('click', toggleDiceSelection));
document.addEventListener('DOMContentLoaded', highlightCurrentPlayerAndRound);
addPlayerBtn.addEventListener('click', addPlayer);
deletePlayerBtn.addEventListener('click', deleteNewestPlayer);

// Constants
const ROW_SUM = 7;
const ROW_BONUS = 8;
const ROW_TOTAL_SCORE = 18;
const ROW_ONE_PAIR = 9;

// Function to move to the next player
function moveToNextPlayer() {
  calculateScoreForCurrentRound();

  currentPlayer++;

  if (currentPlayer > playerCount) {
    currentPlayer = 1;
    currentRound++;
  }

  // Skip bonus and sum row
  if (currentRound === ROW_SUM || currentRound === ROW_BONUS) {
    currentRound = ROW_ONE_PAIR;
  }

  rollsLeft = 3;
  selectedDice = [];

  // Reset dice border
  diceImages.forEach(dice => (dice.style.border = 'none'));

  highlightCurrentPlayerAndRound();
  checkIfGameFinished();
}

function calculateScoreForCurrentRound() {
  const diceValues = [...diceImages].map(d => parseInt(d.dataset.value, 10));
  const target = currentRound;
  const score = diceValues.reduce((acc, val) => val === target ? acc + val : acc, 0);

  const scoreCell = scoreTbody.querySelector(`tr:nth-child(${currentRound}) .player-${currentPlayer}-cell`);
  if (scoreCell) scoreCell.textContent = score;
}

function updateSumAndBonus() {
  for (let pid = 1; pid <= playerCount; pid++) {
    const playerCells = scoreTbody.querySelectorAll(`.player-${pid}-cell`);
    let sum = 0;

    playerCells.forEach((cell, i) => {
      if (i < 6) sum += parseInt(cell.textContent, 10) || 0;
    });

    scoreTbody.querySelector(`tr:nth-child(${ROW_SUM}) .player-${pid}-cell`).textContent = sum;
    scoreTbody.querySelector(`tr:nth-child(${ROW_BONUS}) .player-${pid}-cell`).textContent = sum >= 65 ? 50 : 0;

    updateTotalScore(pid);
  }
}

function updateTotalScore(playerId, gameFinished = false) {
  const playerCells = scoreTbody.querySelectorAll(`.player-${playerId}-cell`);
  let total = 0;

  total += parseInt(scoreTbody.querySelector(`tr:nth-child(${ROW_SUM}) .player-${playerId}-cell`).textContent, 10) || 0;
  total += parseInt(scoreTbody.querySelector(`tr:nth-child(${ROW_BONUS}) .player-${playerId}-cell`).textContent, 10) || 0;

  playerCells.forEach((cell, i) => {
    if (i >= 9 && i <= 16) total += parseInt(cell.textContent, 10) || 0;
  });

  const totalCell = scoreTbody.querySelector(`tr:nth-child(${ROW_TOTAL_SCORE}) .player-${playerId}-cell`);
  if (totalCell) totalCell.textContent = gameFinished ? total : '';
}

function calculateLowerSectionScore(playerId, rowIndex) {
    const diceValues = [...diceImages].map(d => parseInt(d.dataset.value, 10));
    const counts = Array(7).fill(0);
    diceValues.forEach(val => counts[val]++);

    let score = 0;

    switch (rowIndex) {
        case 9: // One Pair
            for (let i = 6; i >= 1; i--) if (counts[i] >= 2) { score = i * 2; break; }
            break;
        case 10: // Two Pair
            const pairs = [];
            for (let i = 6; i >= 1; i--) if (counts[i] >= 2) pairs.push(i * 2);
            if (pairs.length >= 2) score = pairs[0] + pairs[1];
            break;
        case 11: // Three of a Kind
            for (let i = 6; i >= 1; i--) if (counts[i] >= 3) { score = i * 3; break; }
            break;
        case 12: // Four of a Kind
            for (let i = 6; i >= 1; i--) if (counts[i] >= 4) { score = i * 4; break; }
            break;
        case 13: // Full House
            let three = 0, pair = 0;
            for (let i = 6; i >= 1; i--) {
                if (counts[i] === 3) three = i * 3;
                else if (counts[i] === 2) pair = i * 2;
            }
            if (three && pair) score = three + pair;
            break;
        case 14: // Small Straight
            if ([1, 2, 3, 4, 5].every(i => counts[i])) score = 15;
            break;
        case 15: // Large Straight
            if ([2, 3, 4, 5, 6].every(i => counts[i])) score = 20;
            break;
        case 16: // Chance
            score = diceValues.reduce((acc, val) => acc + val, 0);
            break;
        case 17: // Yahtzee
            if (counts.some(c => c === 5)) score = 50;
            break;
    }

    const scoreCell = scoreTbody.querySelector(`tr:nth-child(${rowIndex + 1}) .player-${playerId}-cell`);
    if (scoreCell) scoreCell.textContent = score;

    updateTotalScore(playerId);
}

function checkIfGameFinished() {
  const allCells = scoreTbody.querySelectorAll('td.player-score-cell');
  const allFilled = [...allCells].every(cell => cell.textContent !== '');

  if (allFilled) {
    for (let pid = 1; pid <= playerCount; pid++) updateTotalScore(pid, true);
    displayRestartButton();
  }
}

function displayRestartButton() {
  if (restartButton) {
    restartButton.style.display = 'block';
    restartButton.addEventListener('click', resetGame);
  }
}
