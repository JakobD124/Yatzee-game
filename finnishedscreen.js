function displayFinishedScreen() {
  // Create a modal or overlay for the finished screen
  const finishedScreen = document.createElement('div');
  finishedScreen.id = 'finished-screen';
  finishedScreen.style.position = 'fixed';
  finishedScreen.style.top = '0';
  finishedScreen.style.left = '0';
  finishedScreen.style.width = '100%';
  finishedScreen.style.height = '100%';
  finishedScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  finishedScreen.style.color = '#fff';
  finishedScreen.style.display = 'flex';
  finishedScreen.style.flexDirection = 'column';
  finishedScreen.style.justifyContent = 'center';
  finishedScreen.style.alignItems = 'center';
  finishedScreen.style.zIndex = '1000';

  // Add a title
  const title = document.createElement('h1');
  title.textContent = 'Game Finished!';
  finishedScreen.appendChild(title);

  // Add the final scores
  const scoreList = document.createElement('ul');
  scoreList.style.listStyle = 'none';
  scoreList.style.padding = '0';

  for (let playerId = 1; playerId <= playerCount; playerId++) {
    const totalCell = scoreTbody.querySelector(`tr:nth-child(18) .player-${playerId}-cell`);
    const playerName = document.querySelector(`.player-${playerId}-header`).textContent;
    const score = totalCell.textContent || 0;

    const listItem = document.createElement('li');
    listItem.textContent = `${playerName}: ${score} points`;
    listItem.style.fontSize = '1.2rem';
    listItem.style.margin = '8px 0';
    scoreList.appendChild(listItem);
  }

  finishedScreen.appendChild(scoreList);

  // Add a restart button
  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart Game';
  restartButton.style.marginTop = '16px';
  restartButton.style.padding = '10px 20px';
  restartButton.style.fontSize = '1rem';
  restartButton.style.backgroundColor = '#0f7a0f';
  restartButton.style.color = '#fff';
  restartButton.style.border = 'none';
  restartButton.style.borderRadius = '8px';
  restartButton.style.cursor = 'pointer';

  restartButton.addEventListener('click', () => {
    location.reload(); // Reload the page to restart the game
  });

  finishedScreen.appendChild(restartButton);

  // Append the finished screen to the body
  document.body.appendChild(finishedScreen);
}