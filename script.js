// Utility function to add thick borders to a row
function setThickBorders(row, top = false, bottom = false) {
  if (top) row.classList.add('thick-border-top');
  if (bottom) row.classList.add('thick-border-bottom');
}

// Track if game started
let gameStarted = false;

// Elements
const rollBtn = document.getElementById('roll-btn');
const addPlayerBtn = document.getElementById('add-player-btn');
const scoreTbody = document.getElementById('score-tbody');
const playerNamesDiv = document.getElementById('player-names');

// Function to disable/enable player name inputs based on gameStarted
function updatePlayerInputs() {
  const inputs = playerNamesDiv.querySelectorAll('input.player-name-input');
  inputs.forEach(input => {
    input.disabled = gameStarted;
    if (gameStarted) {
      input.style.borderBottom = 'none';
      input.style.backgroundColor = 'transparent';
      input.style.color = '#000';
      input.style.fontWeight = '600';
      input.style.textAlign = 'center';
    } else {
      input.style.borderBottom = '1px solid transparent';
      input.style.backgroundColor = 'transparent';
      input.style.color = '#000';
      input.style.fontWeight = '600';
      input.style.textAlign = 'center';
    }
  });
}

// Add player function
function addPlayer() {
  if (gameStarted) return; // no adding after game start

  // Count current players
  const currentPlayers = playerNamesDiv.querySelectorAll('input.player-name-input').length;
  if (currentPlayers >= 6) return; // limit max players to 6 for layout

  // Create new input for player name
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.maxLength = 10;
  newInput.value = `Player${currentPlayers + 1}`;
  newInput.className = 'player-name-input';
  newInput.setAttribute('aria-label', `Player ${currentPlayers + 1} name`);
  newInput.style.width = '6.5rem';
  newInput.style.textAlign = 'center';
  newInput.style.fontWeight = '600';
  newInput.style.fontSize = '1rem';
  newInput.style.color = '#000';
  newInput.style.backgroundColor = 'transparent';
  newInput.style.border = 'none';
  newInput.style.borderBottom = '1px solid transparent';
  newInput.style.outline = 'none';
  newInput.style.transition = 'border-color 0.2s';
  newInput.addEventListener('focus', () => {
    newInput.style.borderColor = '#0f7a0f';
    newInput.style.backgroundColor = '#f9e6c0';
    newInput.style.borderRadius = '4px';
  });
  newInput.addEventListener('blur', () => {
    newInput.style.borderColor = 'transparent';
    newInput.style.backgroundColor = 'transparent';
    newInput.style.borderRadius = '0';
  });

  // Append new input
  playerNamesDiv.appendChild(newInput);

  // Add new column to score table for the new player
  const headerRow = scoreTbody.parentElement.querySelector('thead tr');
  const newTh = document.createElement('th');
  newTh.style.border = '1px solid black';
  newTh.style.backgroundColor = 'white';
  newTh.style.padding = '8px 12px';
  newTh.textContent = newInput.value;
  headerRow.appendChild(newTh);

  // Add empty cells for each row in tbody
  const rows = scoreTbody.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const newTd = document.createElement('td');
    newTd.style.border = '1px solid black';
    newTd.style.padding = '8px 12px';
    // Alternate background color for new player column
    if ((headerRow.children.length - 1) % 2 === 0) {
      newTd.style.backgroundColor = 'white';
    } else {
      newTd.style.backgroundColor = '#f9e6c0';
    }
    row.appendChild(newTd);
  });

  // Update input's aria-label and header text on input change
  newInput.addEventListener('input', () => {
    newTh.textContent = newInput.value || `Player${currentPlayers + 1}`;
  });
}

// On add player button click
addPlayerBtn.addEventListener('click', addPlayer);

// On roll dice button click, mark game started and disable editing
rollBtn.addEventListener('click', () => {
  if (!gameStarted) {
    gameStarted = true;
    updatePlayerInputs();
    addPlayerBtn.disabled = true;
  }
});

// Initialize inputs enabled
updatePlayerInputs();

// Set thick borders on relevant rows (already done via classes in HTML, but just in case)
const rows = scoreTbody.querySelectorAll('tr');
rows.forEach(row => {
  const text = row.cells[0].textContent.trim().toLowerCase();
  if (text === 'sum') setThickBorders(row, true, false);
  if (text === 'bonus') setThickBorders(row, false, true);
  if (text === 'yahtzee' || text === 'total score') setThickBorders(row, true, true);
});