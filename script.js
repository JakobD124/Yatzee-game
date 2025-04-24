// Select DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');

let gameStarted = false; // Track if the game has started
let playerCount = 2; // Start with 2 players by default

// Function to initialize existing players (Player 1 and Player 2)
function initializeExistingPlayers() {
  const existingPlayers = playerNamesDiv.querySelectorAll('.player-container');
  existingPlayers.forEach((playerContainer, index) => {
    const playerLabel = playerContainer.querySelector('.player-label');
    const playerValue = playerContainer.querySelector('.player-value');

    // Create an input field for the player name
    const playerInput = document.createElement('input');
    playerInput.type = 'text';
    playerInput.maxLength = 10;
    playerInput.value = `Player ${index + 1}`; // Default name
    playerInput.className = 'player-name-input';
    playerInput.setAttribute('aria-label', `Player ${index + 1} name`);

    // Style the input field
    playerInput.style.width = '6.5rem';
    playerInput.style.textAlign = 'center';
    playerInput.style.fontWeight = '600';
    playerInput.style.fontSize = '1rem';
    playerInput.style.color = '#000';
    playerInput.style.backgroundColor = 'transparent';
    playerInput.style.border = 'none';
    playerInput.style.borderBottom = '1px solid transparent';
    playerInput.style.outline = 'none';
    playerInput.style.transition = 'border-color 0.2s';

    // Add focus and blur event listeners for styling
    playerInput.addEventListener('focus', () => {
      playerInput.style.borderColor = '#0f7a0f';
      playerInput.style.backgroundColor = '#f9e6c0';
      playerInput.style.borderRadius = '4px';
    });
    playerInput.addEventListener('blur', () => {
      playerInput.style.borderColor = 'transparent';
      playerInput.style.backgroundColor = 'transparent';
      playerInput.style.borderRadius = '0';
    });

    // Replace the player value span with the input field
    playerValue.replaceWith(playerInput);

    // Add a column to the score table for the player
    const newTh = document.createElement('th');
    newTh.style.border = '1px solid black';
    newTh.style.backgroundColor = 'white';
    newTh.style.padding = '8px 12px';
    newTh.textContent = playerInput.value;
    scoreTableHead.appendChild(newTh);

    // Add a new cell to each row in the score table body
    const rows = scoreTbody.querySelectorAll('tr');
    rows.forEach((row) => {
      const newCell = document.createElement('td');
      newCell.style.border = '1px solid black';
      newCell.style.padding = '8px 12px';
      newCell.textContent = ''; // Default score
      row.appendChild(newCell);
    });

    // Update the column header dynamically when the player name changes
    playerInput.addEventListener('input', () => {
      newTh.textContent = playerInput.value || `Player ${index + 1}`;
    });
  });
}

// Function to add a new player
function addPlayer() {
  if (gameStarted) return; // Prevent adding players after the game has started

  if (playerCount >= 10) return; // Limit the maximum number of players to 6

  playerCount++;

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

  // Style the input field
  newPlayerInput.style.width = '6.5rem';
  newPlayerInput.style.textAlign = 'center';
  newPlayerInput.style.fontWeight = '600';
  newPlayerInput.style.fontSize = '1rem';
  newPlayerInput.style.color = '#000';
  newPlayerInput.style.backgroundColor = 'transparent';
  newPlayerInput.style.border = 'none';
  newPlayerInput.style.borderBottom = '1px solid transparent';
  newPlayerInput.style.outline = 'none';
  newPlayerInput.style.transition = 'border-color 0.2s';

  // Add focus and blur event listeners for styling
  newPlayerInput.addEventListener('focus', () => {
    newPlayerInput.style.borderColor = '#0f7a0f';
    newPlayerInput.style.backgroundColor = '#f9e6c0';
    newPlayerInput.style.borderRadius = '4px';
  });
  newPlayerInput.addEventListener('blur', () => {
    newPlayerInput.style.borderColor = 'transparent';
    newPlayerInput.style.backgroundColor = 'transparent';
    newPlayerInput.style.borderRadius = '0';
  });

  // Append the label and input to the new player container
  newPlayerContainer.appendChild(newPlayerLabel);
  newPlayerContainer.appendChild(newPlayerInput);

  // Append the new player container to the player names container
  playerNamesDiv.appendChild(newPlayerContainer);

  // Add a column to the score table for the new player
  const newTh = document.createElement('th');
  newTh.style.border = '1px solid black';
  newTh.style.backgroundColor = 'white';
  newTh.style.padding = '8px 12px';
  newTh.textContent = newPlayerInput.value;
  scoreTableHead.appendChild(newTh);

  // Add a new cell to each row in the score table body
  const rows = scoreTbody.querySelectorAll('tr');
  rows.forEach((row) => {
    const newCell = document.createElement('td');
    newCell.style.border = '1px solid black';
    newCell.style.padding = '8px 12px';
    newCell.textContent = '0'; // Default score
    row.appendChild(newCell);
  });

  // Update the column header dynamically when the player name changes
  newPlayerInput.addEventListener('input', () => {
    newTh.textContent = newPlayerInput.value || `Player ${playerCount}`;
  });
}

// Initialize existing players
initializeExistingPlayers();

// Add event listener to the "Add Player" button
addPlayerBtn.addEventListener('click', addPlayer);