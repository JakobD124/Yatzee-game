// Select DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');

let playerCount = 0; // Start with 0 players
let gameStarted = false; // Tracks whether the game has started

// Function to add a new player
function addPlayer() {
    if (gameStarted) {
        alert("You cannot add new players after the game has started!");
        return;
    }

    if (playerCount >= 6) return; // Limit the maximum number of players to 6

    playerCount++; // Increment the player count

    // Create a new row for the player
    const newRow = document.createElement('tr');
    newRow.id = `player-${playerCount}`;

    // Create the "Player" cell
    const playerCell = document.createElement('td');
    playerCell.textContent = `Player ${playerCount}`;
    playerCell.className = 'player-label';

    // Create the "Name" cell with an input field
    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 10;
    nameInput.value = `Player ${playerCount}`; // Default name
    nameInput.className = 'player-name-input';
    nameInput.setAttribute('aria-label', `Player ${playerCount} name`);
    nameCell.appendChild(nameInput);

    // Append cells to the row
    newRow.appendChild(playerCell);
    newRow.appendChild(nameCell);

    // Append the row to the player list table
    document.getElementById('player-names-container').appendChild(newRow);

    // Add a column to the score table for the new player
    const newTh = document.createElement('th');
    newTh.textContent = nameInput.value; // Initialize with the default name
    newTh.className = `player-header player-${playerCount}-header`; // Use CSS class for styling
    newTh.dataset.playerId = playerCount; // Add a data attribute for easy identification
    scoreTableHead.appendChild(newTh);

    // Add a new cell to each row in the score table body
    const rows = scoreTbody.querySelectorAll('tr');
    rows.forEach((row) => {
        const newCell = document.createElement('td');
        newCell.textContent = ''; // Default score
        newCell.className = `player-score-cell player-${playerCount}-cell`; // Use CSS class for styling
        newCell.dataset.playerId = playerCount; // Add a data attribute for easy identification
        row.appendChild(newCell);
    });

    // Update the column header dynamically when the player name changes
    nameInput.addEventListener('input', () => {
        newTh.textContent = nameInput.value || `Player ${playerCount}`;
    });
}
  // Function to delete the newest player
function deleteNewestPlayer() {
    if (playerCount === 0) return; // No players to delete
  
    // Find the newest player container
    const newestPlayerContainer = document.getElementById(`player-${playerCount}`);
    if (newestPlayerContainer) newestPlayerContainer.remove();
  
    // Remove the corresponding column header
    const newestPlayerHeader = scoreTableHead.querySelector(`.player-${playerCount}-header`);
    if (newestPlayerHeader) newestPlayerHeader.remove();
  
    // Remove the corresponding cells in the score table body
    const newestPlayerCells = scoreTbody.querySelectorAll(`.player-${playerCount}-cell`);
    newestPlayerCells.forEach((cell) => cell.remove());
  
    // Decrement the player count
    playerCount--;
  }

  
// Attach event listeners to the buttons
addPlayerBtn.addEventListener('click', addPlayer);
deletePlayerBtn.addEventListener('click', deleteNewestPlayer);

// Initialize the first player when the page loads
addPlayer();