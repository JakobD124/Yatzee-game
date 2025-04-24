// Select DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');

let playerCount = 0; // Start with 0 players
let gameStarted = false; // Flag to check if the game has started

// Function to add a new player
function addPlayer() {
  if (playerCount >= 6) return; // Limit the maximum number of players to 6

  playerCount++; // Increment the player count

  // Create a new player container
  const newPlayerContainer = document.createElement('div');
  newPlayerContainer.className = 'player-container';

  // Create a label for the new player
  const newPlayerLabel = document.createElement('span');
  newPlayerLabel.className = 'player-label';
  newPlayerLabel.textContent = `Player ${playerCount}:`;

  // Create an input field for the new player name
  const newPlayerInput = document.createElement('input');
  newPlayerInput.type = 'text';
  newPlayerInput.maxLength = 10;
  newPlayerInput.value = `Player ${playerCount}`; // Default name
  newPlayerInput.className = 'player-name-input';
  newPlayerInput.setAttribute('aria-label', `Player ${playerCount} name`);

  // Append the label and input to the new player container
  newPlayerContainer.appendChild(newPlayerLabel);
  newPlayerContainer.appendChild(newPlayerInput);

  // Append the new player container to the player names container
  playerNamesDiv.appendChild(newPlayerContainer);

  // Add a column to the score table for the new player
  const newTh = document.createElement('th');
  newTh.textContent = newPlayerInput.value; // Initialize with the default name
  newTh.className = 'player-header'; // Use CSS class for styling
  scoreTableHead.appendChild(newTh);

  // Add a new cell to each row in the score table body
  const rows = scoreTbody.querySelectorAll('tr');
  rows.forEach((row) => {
    const newCell = document.createElement('td');
    newCell.textContent = ''; // Default score
    newCell.className = 'player-score-cell'; // Use CSS class for styling
    row.appendChild(newCell);
  });

  // Update the column header dynamically when the player name changes
  newPlayerInput.addEventListener('input', () => {
    newTh.textContent = newPlayerInput.value || `Player ${playerCount}`;
  });
}

// Add event listener to the "Add Player" button
addPlayerBtn.addEventListener('click', addPlayer);

// Initialize the first player when the page loads
addPlayer();