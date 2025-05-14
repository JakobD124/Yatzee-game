import * as UI from './Dice-Game-UI.js';
import { getPlayerCount } from './Player.js';

// Constants
const ROW_SUM = 7;
const ROW_BONUS = 8;
const ROW_ONE_PAIR = 9;
const ROW_TOTAL_SCORE = 18;
const scoreTbody = document.querySelector('#score-table tbody');

// Function to move to the next player
function moveToNextPlayer() {
  calculateScoreForCurrentRound();

  UI.currentPlayer++;

  const playerCount = getPlayerCount();
  if (UI.currentPlayer > playerCount) {
    UI.currentPlayer = 1;
    UI.currentRound++;
  }

  // Skip bonus and sum row
  if (UI.currentRound === ROW_SUM || UI.currentRound === ROW_BONUS) {
    UI.currentRound = ROW_ONE_PAIR;
  }

  if (UI.currentRound === ROW_TOTAL_SCORE) {
    endGame();
  }

  UI.rollsLeft = 3;
  UI.selectedDice = [];
  UI.diceImages.forEach(dice => dice.style.border = 'none');

  highlightCurrentPlayerAndRound();
  checkIfGameFinished();
}

function calculateScoreForCurrentRound() {
  const diceValues = [...UI.diceImages].map(d => parseInt(d.dataset.value, 10));
  const target = UI.currentRound;
  const score = diceValues.reduce((acc, val) => val === target ? acc + val : acc, 0);

  const scoreCell = scoreTbody.querySelector(`tr:nth-child(${UI.currentRound}) .player-${UI.currentPlayer}-cell`);
  if (scoreCell) scoreCell.textContent = score;
}

function updateSumAndBonus() {
  const playerCount = getPlayerCount();
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
  const diceValues = [...UI.diceImages].map(d => parseInt(d.dataset.value, 10));
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
    const playerCount = getPlayerCount();
    for (let pid = 1; pid <= playerCount; pid++) updateTotalScore(pid, true);
    displayRestartButton();
  }
}

function displayRestartButton() {
  if (UI.restartButton) {
    UI.restartButton.style.display = 'block';
    UI.restartButton.addEventListener('click', UI.resetGame);
  }
}

function highlightCurrentPlayerAndRound() {
  const allCells = scoreTbody.querySelectorAll('td');
  const allRows = scoreTbody.querySelectorAll('tr');

  allCells.forEach(cell => cell.classList.remove('current-player-column'));
  allRows.forEach(row => row.classList.remove('current-round-row'));

  const roundRow = scoreTbody.querySelector(`tr:nth-child(${UI.currentRound})`);
  if (roundRow) roundRow.classList.add('current-round-row');

  const columnCells = scoreTbody.querySelectorAll(`.player-${UI.currentPlayer}-cell`);
  columnCells.forEach(cell => cell.classList.add('current-player-column'));
}

function endGame() {
  alert('Game finished!');
}

// Exports
export {
  moveToNextPlayer,
  checkIfGameFinished,
  calculateScoreForCurrentRound,
  updateSumAndBonus,
  updateTotalScore,
  calculateLowerSectionScore,
  highlightCurrentPlayerAndRound
};
