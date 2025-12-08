import Game from "./Game"

document.addEventListener('DOMContentLoaded', () => {
  const statsContainer = document.querySelector('.stats');
  if (statsContainer) {
    const missedElement = document.createElement('div');
    missedElement.className = 'stat';
    missedElement.innerHTML = `
      <span class="stat-label">Пропущено:</span>
      <span id="missed" class="stat-value">0/5</span>
    `;
    statsContainer.insertBefore(missedElement, statsContainer.children[2]);
  }
  
  new Game();
});