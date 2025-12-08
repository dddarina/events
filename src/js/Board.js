export default class Board {
  constructor(size) {
    this.size = size;
    this.totalCells = size * size;
    this.element = document.getElementById('gameBoard');
    this.cells = [];
  }
  
  render() {
    this.element.innerHTML = '';
    this.cells = [];
    
    for (let i = 0; i < this.totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'hole cell';
      cell.dataset.index = i; 
      const cellInner = document.createElement('div');
      cellInner.className = 'hole-inner';
      cell.appendChild(cellInner);
      
      this.element.appendChild(cell);
      this.cells.push(cell);
    }
  }
  
  getRandomPosition() {
    return Math.floor(Math.random() * this.totalCells);
  }
  
  getCell(position) {
    return this.cells[position];
  }
}