import { moveToNextPlayer, checkIfGameFinished } from './Dice-Game-logic.js';

// DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');

let playerCount = 0;
let gameStarted = false;

// --- Add Player ---
function addPlayer() {
    if (gameStarted) {
        alert("You cannot add players after the game has started!");
        return;
    }

    if (playerCount >= 6) return; // Limit to 6 players

    playerCount++; // Increment player count

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

// Exports
export { addPlayer, deleteNewestPlayer, ensureMinimumPlayers, playerCount, gameStarted};