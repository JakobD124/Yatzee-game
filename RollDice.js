// Select the Roll Dice button, dice row, and score table
const rollDiceButton = document.getElementById('roll-btn');
const diceImages = document.querySelectorAll('.dice-row img');
const scoreTable = document.getElementById('score-table');

// Variables to track the game state
let currentPlayer = 1; // Start with Player 1
let rollsLeft = 3; // Each player gets 3 rolls
let selectedDice = []; // Track selected dice

// Function to generate a random number between 1 and 6
function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to roll the dice
function rollDice() {
  if (rollsLeft === 0) {
    alert(`Player ${currentPlayer} has no rolls left!`);
    return;
  }

  diceImages.forEach((dice, index) => {
    // Only roll dice that are not selected
    if (!selectedDice.includes(index)) {
      const randomNumber = getRandomDiceNumber(); // Get a random number between 1 and 6
      dice.src = `Terninger/${randomNumber}.JPG`; // Update the dice image source
      dice.alt = `Dice showing ${randomNumber}`; // Update the alt text for accessibility
      dice.dataset.value = randomNumber; // Store the dice value in a data attribute
    }
  });

  rollsLeft--; // Decrease the number of rolls left
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

// Function to calculate the sum for the current player and update the score table
function updateScoreTable() {
  if (rollsLeft > 0 && selectedDice.length < diceImages.length) {
    alert(`Player ${currentPlayer} must finish rolling or select all dice!`);
    return;
  }

  // Calculate the sum for each dice value (1-6)
  const diceValues = Array.from(diceImages).map((dice) => parseInt(dice.dataset.value, 10));
  const score = diceValues.reduce((acc, value) => {
    if (value === currentPlayer) {
      return acc + value;
    }
    return acc;
  }, 0);

  // Update the score table for the current player
  const scoreRow = scoreTable.querySelectorAll('tbody tr')[currentPlayer - 1];
  const scoreCell = scoreRow.querySelectorAll('td')[0]; // Update the first column for simplicity
  if (scoreCell) {
    scoreCell.textContent = score;
  }

  // Reset for the next player
  currentPlayer++;
  rollsLeft = 3;
  selectedDice = [];
  diceImages.forEach((dice) => (dice.style.border = 'none')); // Clear dice selection
}

// Add event listeners
rollDiceButton.addEventListener('click', rollDice);
diceImages.forEach((dice) => dice.addEventListener('click', toggleDiceSelection));