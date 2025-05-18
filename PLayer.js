import { moveToNextPlayer, checkIfGameFinished, calculateScoreForCurrentRound, updateSumAndBonus, updateTotalScore, calculateLowerSectionScore } from './Dice-Game-logic.js';
import { gameState } from './Dice-Game-UI.js';

// DOM elements
const playerNamesDiv = document.getElementById('player-names-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const scoreTableHead = document.querySelector('#score-table thead tr');
const scoreTbody = document.getElementById('score-tbody');

let PlayerCount = 0;

function updatePlayerCountDisplay() {
    const PlayerCountDisplay = document.getElementById('player-count-display');
    if (PlayerCountDisplay) {
        PlayerCountDisplay.textContent = `Players: ${PlayerCount}`;
    }
}

// --- Add Player ---
function addPlayer() {
    if (gameState.gameStarted) {
        alert("You cannot add players after the game has started!");
        return;
    }

    if (PlayerCount >= 6) return; // Limit to 6 players

    PlayerCount++; // Increment player count
    updatePlayerCountDisplay();

    // Player name row
    const newRow = document.createElement('tr');
    newRow.id = `player-${PlayerCount}`;

    const playerCell = document.createElement('td');
    playerCell.textContent = `Player ${PlayerCount}`;
    playerCell.className = 'player-label';

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 10;
    nameInput.value = `Player ${PlayerCount}`;
    nameInput.className = 'player-name-input';
    nameInput.setAttribute('aria-label', `Player ${PlayerCount} name`);
    nameCell.appendChild(nameInput);

    newRow.appendChild(playerCell);
    newRow.appendChild(nameCell);
    playerNamesDiv.appendChild(newRow);

    // Add score table column
    const newTh = document.createElement('th');
    newTh.textContent = nameInput.value;
    newTh.className = `player-header player-${PlayerCount}-header`;
    newTh.dataset.playerId = PlayerCount;
    scoreTableHead.appendChild(newTh);

    // Add cells to each row in score body
    const rows = scoreTbody.querySelectorAll('tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.textContent = '';
        newCell.className = `player-score-cell player-${PlayerCount}-cell`;
        newCell.dataset.playerId = PlayerCount;
        row.appendChild(newCell);
    });

    // Live update header on name change
    nameInput.addEventListener('input', () => {
        newTh.textContent = nameInput.value || `Player ${PlayerCount}`;
    });
}

// --- Delete Player ---
function deleteNewestPlayer() {
    if (gameState.gameStarted) {
        alert("You cannot delete players after the game has started!");
        return;
    }

    if (PlayerCount <= 1) return; // Prevent deleting the last player

    const playerRow = document.getElementById(`player-${PlayerCount}`);
    if (playerRow) playerRow.remove();

    const header = scoreTableHead.querySelector(`.player-${PlayerCount}-header`);
    if (header) header.remove();

    const scoreCells = scoreTbody.querySelectorAll(`.player-${PlayerCount}-cell`);
    scoreCells.forEach(cell => cell.remove());

    PlayerCount--; // Decrement player count
    updatePlayerCountDisplay();

    // Ensure at least one player remains
    ensureMinimumPlayers();
}

// --- Ensure Minimum Players ---
function ensureMinimumPlayers() {
    if (PlayerCount === 0) {
        addPlayer(); // Add a player if none exist
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    ensureMinimumPlayers(); // Ensure at least 1 player on load
});

addPlayerBtn.addEventListener('click', addPlayer);
deletePlayerBtn.addEventListener('click', deleteNewestPlayer);
document.addEvebntListener('DOMContetnLoaded', ernsureMinimumPlayers);

// Exports
export function getPlayerCount() {
    return PlayerCount;
}
export {addPlayer, deleteNewestPlayer, ensureMinimumPlayers, scoreTbody };