import * as UI from './Dice-Game-UI.js';
import { getPlayerCount } from './PLayer.js';


// Constants
const ROW_SUM = 7;
const ROW_BONUS = 8;
const ROW_ONE_PAIR = 9;
const ROW_TOTAL_SCORE = 18;
const scoreTbody = document.querySelector('#score-table tbody');


// Function to move to the next player
function moveToNextPlayer() {

  if  (UI.gameState.rollsLeft === 3) {
    alert(`Player ${UI.gameState.currentPlayer} has to roll atleast one time!`);
    return;
  }
    calculateScoreForCurrentRound();

    const PlayerCount = getPlayerCount();
    const isLastPlayer = UI.gameState.currentPlayer === PlayerCount;

    UI.setCurrentPlayer(UI.gameState.currentPlayer + 1);
    
    if (isLastPlayer && UI.gameState.currentRound >= 6) {
      updateSumAndBonus();
    }

    if (UI.gameState.currentPlayer > PlayerCount) {
        UI.setCurrentPlayer(1);
        UI.gameState.currentRound++;
    }

    if (UI.gameState.currentRound === ROW_SUM || UI.gameState.currentRound === ROW_BONUS) {
        UI.gameState.currentRound = ROW_ONE_PAIR;
    }

    if (UI.gameState.currentRound === ROW_TOTAL_SCORE) {
        endGame();
    }

    UI.gameState.rollsLeft = 3;
    UI.gameState.selectedDice = [];

    highlightCurrentPlayerAndRound();
    checkIfGameFinished();
    clearDiceSelection();
}

function clearDiceSelection() {
  document.querySelectorAll('.dice').forEach(dice => {
    dice.style.border = 'none';
  });
}

// Calculate only the upper section score (1–6)
function calculateScoreForCurrentRound() {
  const diceValues = [...UI.diceImages]
    .map(d => parseInt(d.dataset.value, 10))
    .filter(v => v >= 1 && v <= 6);

  const target = UI.gameState.currentRound;
  let score = 0;

  // Upper section (1–6)
  if (target >= 1 && target <= 6) {
    score = diceValues.reduce((acc, val) => val === target ? acc + val : acc, 0);
    const scoreCell = scoreTbody.querySelector(`tr:nth-child(${target}) .player-${UI.gameState.currentPlayer}-cell`);
    if (scoreCell) {
      scoreCell.textContent = score;
    }

    updateTotalScore(UI.gameState.currentPlayer);
  }

  // Lower section (9–17)
  else if (target >= 9 && target <= 17) {
    calculateLowerSectionScore(UI.gameState.currentPlayer, target);
  }
}



function updateSumAndBonus() {
  const PlayerCount = getPlayerCount();
  for (let pid = 1; pid <= PlayerCount; pid++) {
    const playerCells = scoreTbody.querySelectorAll(`.player-${pid}-cell`);

    let sum = 0;
    playerCells.forEach((cell, i) => {
      if (i < 6) sum += parseInt(cell.textContent, 10) || 0;
    });

    scoreTbody.querySelector(`tr:nth-child(${ROW_SUM}) .player-${pid}-cell`).textContent = sum;
    scoreTbody.querySelector(`tr:nth-child(${ROW_BONUS}) .player-${pid}-cell`).textContent = sum >= 42 ? 50 : 0;

    updateTotalScore(pid);
  }
}

// Updated calculateLowerSectionScore to match strict Yahtzee rules
function calculateLowerSectionScore(playerId, target) {
  // Gather current dice values
  const diceValues = [...UI.diceImages]
    .map(d => parseInt(d.dataset.value, 10))
    .filter(v => v >= 1 && v <= 6);

  const counts = Array(7).fill(0);
  diceValues.forEach(val => {
    if (val >= 1 && val <= 6) counts[val]++;
  });

  let score = 0;
  switch (target) {
    case ROW_ONE_PAIR: // One Pair
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 2) {
          score = i * 2;
          break;
        }
      }
      break;

    case 10: // Two Pairs
      const pairs = [];
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 2) pairs.push(i);
      }
      if (pairs.length >= 2) {
        score = pairs[0] * 2 + pairs[1] * 2;
      }
      break;

    case 11: // Three of a Kind
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 3) {
          score = i * 3;
          break;
        }
      }
      break;

    case 12: // Four of a Kind
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 4) {
          score = i * 4;
          break;
        }
      }
      break;

    case 13: // Full House (three of one number and two of another)
      let threeVal = 0, twoVal = 0;
      for (let i = 1; i <= 6; i++) {
        if (counts[i] === 3) threeVal = i;
        else if (counts[i] === 2) twoVal = i;
      }
      if (threeVal && twoVal) {
        score = threeVal * 3 + twoVal * 2;
      }
      break;

    case 14: // Small Straight (1-5)
      if ([1, 2, 3, 4, 5].every(v => counts[v] >= 1)) score = 15;
      break;

    case 15: // Large Straight (2-6)
      if ([2, 3, 4, 5, 6].every(v => counts[v] >= 1)) score = 20;
      break;

    case 16: // Chance (sum of all dice)
      score = diceValues.reduce((a, b) => a + b, 0);
      break;

    case 17: // Yahtzee (five of a kind)
      if (counts.some(c => c === 5)) score = 50;
      break;

    default:
      break;
  }

  // Write back to the corresponding table cell
  const scoreCell = scoreTbody.querySelector(`tr:nth-child(${target}) .player-${playerId}-cell`);
  if (scoreCell) scoreCell.textContent = score;

  updateTotalScore(playerId);
}

function updateTotalScore(playerId, gameFinished = false) {
    const totalCell = document.querySelector(`tr:nth-child(${ROW_TOTAL_SCORE}) .player-${playerId}-cell`);
    
    if (!totalCell) {
        console.warn(`Total score cell for Player ${playerId} not found.`);
        return;
    }

    let total = 0;

    // Sum upper section (1-6)
    for (let i = 1; i <= 6; i++) {
        const cell = document.querySelector(`tr:nth-child(${i}) .player-${playerId}-cell`);
        total += cell ? parseInt(cell.textContent, 10) || 0 : 0;
    }

    // Add bonus
    const bonusCell = document.querySelector(`tr:nth-child(${ROW_BONUS}) .player-${playerId}-cell`);
    total += bonusCell ? parseInt(bonusCell.textContent, 10) || 0 : 0;

    // Sum lower section (9-17)
    for (let i = 9; i <= 17; i++) {
        const cell = document.querySelector(`tr:nth-child(${i}) .player-${playerId}-cell`);
        total += cell ? parseInt(cell.textContent, 10) || 0 : 0;
    }

    // Update total score cell
    totalCell.textContent = gameFinished ? total : '';
}


function highlightCurrentPlayerAndRound() {
  const allCells = scoreTbody.querySelectorAll('td');
  const allRows = scoreTbody.querySelectorAll('tr');

  allCells.forEach(cell => cell.classList.remove('current-player-column'));
  allRows.forEach(row => row.classList.remove('current-round-row'));

  const roundRow = scoreTbody.querySelector(`tr:nth-child(${UI.gameState.currentRound})`);
  if (roundRow) roundRow.classList.add('current-round-row');

  const columnCells = document.querySelectorAll(`.player-${UI.gameState.currentPlayer}-cell`);
  columnCells.forEach(cell => cell.classList.add('current-player-column'));
}


function clearAllHighlighting() {
    document.querySelectorAll('.highlight, .current-player-column, .current-round-row')
        .forEach(el => el.classList.remove('highlight', 'current-player-column', 'current-round-row'));
}


function checkIfGameFinished() {
  const allCells = scoreTbody.querySelectorAll('td.player-score-cell');
  const allFilled = [...allCells].every(cell => cell.textContent !== '');

  if (allFilled) {
    const playerCount = getPlayerCount();
    for (let pid = 1; pid <= playerCount; pid++) updateTotalScore(pid, true);
    clearAllHighlighting();
    displayRestartButton();
  }
}

function displayRestartButton() {
  if (UI.restartButton) {
    UI.restartButton.style.display = 'block';
    UI.restartButton.addEventListener('click', UI.resetGame);
  }
}


function endGame() {
    const playerCount = getPlayerCount();
    
    for (let pid = 1; pid <= playerCount; pid++) {
        updateTotalScore(pid, true);
    }

    alert('Game finished!');
    document.getElementById('restart-game-btn').style.display = 'block';
    clearAllHighlighting();
}


document.getElementById("restart-game-btn").addEventListener("click", function() {
    location.reload(); 
});

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