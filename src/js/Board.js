export default class Board {
  constructor(size = 4) {
    this.size = size;
    this.totalCells = size * size;
    this.element = document.getElementById('gameBoard');
    this.lastGoblinPosition = null;
  }

  render() {
    this.element.innerHTML = '';
    
    for (let i = 0; i < this.totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      
      const hole = document.createElement('div');
      hole.className = 'hole';
      
      const holeInner = document.createElement('div');
      holeInner.className = 'hole-inner';
      
      hole.append(holeInner);
      cell.append(hole); 
      this.element.append(cell); 
    }
  }

  getRandomPosition() {
    const allPositions = Array.from({length: this.totalCells}, (_, i) => i);
    
    const availablePositions = this.lastGoblinPosition !== null 
      ? allPositions.filter(pos => pos !== this.lastGoblinPosition)
      : allPositions;
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const newPosition = availablePositions[randomIndex];
    
    this.lastGoblinPosition = newPosition;
    return newPosition;
  }

  resetPositionHistory() {
    this.lastGoblinPosition = null;
  }
}