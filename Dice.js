// Select the Roll Dice button, Next Player button, dice row, and score table
const rollDiceButton = document.getElementById('roll-btn');
const nextPlayerButton = document.getElementById('next-player-btn');
const diceImages = document.querySelectorAll('.dice-row img');
const scoreTable = document.getElementById('score-table');

// Variables to track the game state
let currentPlayer = 1;
let rollsLeft = 3;
let selectedDice = [];
let currentRound = 1;

// Function to generate a random number between 1 and 6
function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to roll the dice
function rollDice() {
    if (!gameStarted) {
        gameStarted = true; // Mark the game as started
        addPlayerBtn.disabled = true; // Disable the "Add Player" button
        deletePlayerBtn.disabled = true; // Disable the "Delete Player" button
    }

    if (rollsLeft === 0) {
        alert(`Player ${currentPlayer} has no rolls left!`);
        return;
    }

    diceImages.forEach((dice, index) => {
        // Only roll dice that are not selected
        if (!selectedDice.includes(index)) {
            const randomNumber = getRandomDiceNumber();
            dice.src = `Terninger/${randomNumber}.JPG`;
            dice.alt = `Dice showing ${randomNumber}`;
            dice.dataset.value = randomNumber; // Ensure this is set correctly
        }
    });

    rollsLeft--;
}

// Function to select or deselect a dice
function toggleDiceSelection(event) {
  const dice = event.target;
  const diceIndex = Array.from(diceImages).indexOf(dice);

  if (selectedDice.includes(diceIndex)) {
    // Deselect the dice
    selectedDice = selectedDice.filter((index) => index !== diceIndex);
    dice.style.border = 'none'; // Remove selection border
  } else {
    // Select the dice
    selectedDice.push(diceIndex);
    dice.style.border = '2px solid #0f7a0f'; // Add selection border
  }
}

// Initialize the first player and highlight the current player and round
document.addEventListener('DOMContentLoaded', () => {
  highlightCurrentPlayerAndRound();
});

// Function to highlight the current player's column and the current round's row
function highlightCurrentPlayerAndRound() {
  // Remove existing highlights
  const allCells = scoreTbody.querySelectorAll('td');
  allCells.forEach((cell) => cell.classList.remove('current-player-column'));

  const allRows = scoreTbody.querySelectorAll('tr');
  allRows.forEach((row) => row.classList.remove('current-round-row'));

  // Highlight the current round's row
  const currentRoundRow = scoreTbody.querySelectorAll('tr')[currentRound - 1];
  if (currentRoundRow) {
    currentRoundRow.classList.add('current-round-row');
  }

  // Highlight the current player's column
  const currentPlayerCells = scoreTbody.querySelectorAll(`.player-${currentPlayer}-cell`);
  currentPlayerCells.forEach((cell) => cell.classList.add('current-player-column'));
}

// Function to move to the next player
function moveToNextPlayer() {
  // Calculate the score for the current player's current round
  calculateScoreForCurrentRound();

  // Check if the upper section is completed for all players
  if (currentRound === 6 && currentPlayer === playerCount) {
    updateSumAndBonus();
    currentRound = 9; // Skip to "One Pair" row
  }

  // Move to the next player
  currentPlayer++;
  if (currentPlayer > playerCount) {
    currentPlayer = 1; // Loop back to the first player
    currentRound++; // Advance to the next round
  }

  // Skip "Sum" and "Bonus" rows
  if (currentRound === 7 || currentRound === 8) {
    currentRound = 9; // Jump to "One Pair"
  }

  rollsLeft = 3; // Reset rolls for the next player
  selectedDice = [];
  diceImages.forEach((dice) => (dice.style.border = 'none')); // Clear dice selection

  // Highlight the current player and round
  highlightCurrentPlayerAndRound();

  // Check if the game is finished
  checkIfGameFinished();
}

// Function to update "Sum" and "Bonus" rows
function updateSumAndBonus() {
  for (let playerId = 1; playerId <= playerCount; playerId++) {
    const playerCells = scoreTbody.querySelectorAll(`.player-${playerId}-cell`);
    let sum = 0;

    // Calculate the sum for the upper section (Ones to Sixes)
    playerCells.forEach((cell, index) => {
      if (index < 6) { // Only calculate for the first 6 rows
        const cellValue = parseInt(cell.textContent, 10) || 0;
        sum += cellValue;
      }
    });

    // Update the "Sum" row
    const sumCell = scoreTbody.querySelector(`tr:nth-child(7) .player-${playerId}-cell`);
    if (sumCell) {
      sumCell.textContent = sum;
    }

    // Update the "Bonus" row if the sum is 65 or more
    const bonusCell = scoreTbody.querySelector(`tr:nth-child(8) .player-${playerId}-cell`);
    if (bonusCell) {
      bonusCell.textContent = sum >= 65 ? 50 : 0;
    }

    // Update the "Total Score" row
    updateTotalScore(playerId);
  }
}

// Function to calculate the score for the current player's current round
function calculateScoreForCurrentRound() {
  const diceValues = Array.from(diceImages).map((dice) => parseInt(dice.dataset.value, 10));
  const targetValue = currentRound; // The value we're checking for (e.g., 1 for "Ones", 2 for "Twos")

  // Count the number of dice matching the target value
  const score = diceValues.reduce((acc, value) => (value === targetValue ? acc + value : acc), 0);

  // Update the score table for the current player and round
  const scoreCell = scoreTbody.querySelector(`tr:nth-child(${currentRound}) .player-${currentPlayer}-cell`);
  if (scoreCell) {
    scoreCell.textContent = score; // Set the calculated score
  }
}

// Function to calculate the sum for the current player's column
function calculatePlayerSum(playerId) {
  const playerCells = scoreTbody.querySelectorAll(`.player-${playerId}-cell`);
  let sum = 0;

  // Iterate through all rows except "Sum", "Bonus", and "Total Score"
  playerCells.forEach((cell, index) => {
    if (index < 6) { // Only calculate for the first 6 rows (Ones to Sixes)
      const cellValue = parseInt(cell.textContent, 10) || 0;
      sum += cellValue;
    }
  });

  // Update the "Sum" row only if the game has reached it
  if (currentRound > 6) {
    const sumCell = scoreTbody.querySelector(`tr:nth-child(7) .player-${playerId}-cell`);
    if (sumCell) {
      sumCell.textContent = sum;
    }

    // Update the "Bonus" row if the sum is 65 or more
    const bonusCell = scoreTbody.querySelector(`tr:nth-child(8) .player-${playerId}-cell`);
    if (bonusCell) {
      bonusCell.textContent = sum >= 65 ? 50 : 0;
    }

    // Update the "Total Score" row
    const totalCell = scoreTbody.querySelector(`tr:nth-child(18) .player-${playerId}-cell`);
    if (totalCell) {
      totalCell.textContent = sum + (sum >= 65 ? 50 : 0);
    }
  }
}

// Function to calculate the score for the lower section
function calculateLowerSectionScore(playerId, rowIndex) {
  const diceValues = Array.from(diceImages).map((dice) => parseInt(dice.dataset.value, 10));
  const counts = Array(7).fill(0); // Array to count occurrences of each dice value (1-6)

  diceValues.forEach((value) => counts[value]++);

  let score = 0;

  switch (rowIndex) {
    case 9: // One Pair
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 2) {
          score = i * 2;
          break;
        }
      }
      break;

    case 10: // Two Pair
      let pairs = [];
      for (let i = 6; i >= 1; i--) {
        if (counts[i] >= 2) {
          pairs.push(i * 2);
          if (pairs.length === 2) break;
        }
      }
      if (pairs.length === 2) score = pairs[0] + pairs[1];
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

    case 13: // Full House
      let threeOfAKind = 0;
      let pair = 0;
      for (let i = 6; i >= 1; i--) {
        if (counts[i] === 3) threeOfAKind = i * 3;
        if (counts[i] === 2) pair = i * 2;
      }
      if (threeOfAKind && pair) score = threeOfAKind + pair;
      break;

    case 14: // Small Straight
      if (counts[1] && counts[2] && counts[3] && counts[4] && counts[5]) score = 15;
      break;

    case 15: // Large Straight
      if (counts[2] && counts[3] && counts[4] && counts[5] && counts[6]) score = 20;
      break;

    case 16: // Chance
      score = diceValues.reduce((acc, value) => acc + value, 0);
      break;

    case 17: // Yahtzee
      if (counts.some((count) => count === 5)) score = 50;
      break;
  }

  // Update the score table for the current player and row
  const scoreCell = scoreTbody.querySelector(`tr:nth-child(${rowIndex + 1}) .player-${playerId}-cell`);
  if (scoreCell) {
    scoreCell.textContent = score;
  }

  // Update the "Total Score" row
  updateTotalScore(playerId);
}

// Add event listeners
rollDiceButton.addEventListener('click', rollDice);
nextPlayerButton.addEventListener('click', moveToNextPlayer);
diceImages.forEach((dice) => dice.addEventListener('click', toggleDiceSelection));

// Initialize the first player when the page loads
highlightCurrentPlayerAndRound();

function updateTotalScore(playerId) {
  const playerCells = scoreTbody.querySelectorAll(`.player-${playerId}-cell`);
  let totalScore = 0;

  // Add the "Sum" row value
  const sumCell = scoreTbody.querySelector(`tr:nth-child(7) .player-${playerId}-cell`);
  const sumValue = parseInt(sumCell.textContent, 10) || 0;
  totalScore += sumValue;

  // Add the "Bonus" row value
  const bonusCell = scoreTbody.querySelector(`tr:nth-child(8) .player-${playerId}-cell`);
  const bonusValue = parseInt(bonusCell.textContent, 10) || 0;
  totalScore += bonusValue;

  // Add the lower section values (rows 9 to 17)
  playerCells.forEach((cell, index) => {
    if (index >= 9 && index <= 16) { // Lower section rows
      const cellValue = parseInt(cell.textContent, 10) || 0;
      totalScore += cellValue;
    }
  });

  // Update the "Total Score" row
  const totalCell = scoreTbody.querySelector(`tr:nth-child(18) .player-${playerId}-cell`);
  if (totalCell) {
    totalCell.textContent = totalScore;
  }
}

function checkIfGameFinished() {
  const allCells = scoreTbody.querySelectorAll('td.player-score-cell');
  let allFilled = true;

  // Check if all cells are filled
  allCells.forEach((cell) => {
    if (cell.textContent === '') {
      allFilled = false;
    }
  });

  if (allFilled) {
    // Show the "Total Score" row
    const totalScoreRow = scoreTbody.querySelector('tr:nth-child(18)');
    totalScoreRow.style.display = 'table-row';

    // Display the finished screen
    displayFinishedScreen();
  }
}