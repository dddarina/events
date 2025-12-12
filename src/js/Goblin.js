export default class Goblin {
  constructor(imageSrc) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.className = 'dwarf goblin';
    this.image.alt = 'Гоблин';
    
    this.currentPosition = null;
    this.isVisible = false;
    this.isBeingHidden = false;
    this.lastPosition = null; 
  }
  
  show(position) {
    if (this.isVisible || this.isBeingHidden) return;
    
    this.currentPosition = position;
    this.isVisible = true;
    this.isBeingHidden = false;
    this.lastPosition = position;
    
    const cell = document.querySelector(`.cell[data-index="${position}"] .hole-inner`);
    if (cell) {
      cell.append(this.image);
      this.image.style.opacity = '1';
      this.image.style.transform = 'scale(1)';
    }
  }
  
  hide() {
    if (!this.isVisible || this.isBeingHidden) return;
    
    this.isBeingHidden = true;
    this.isVisible = false;
    
    this.image.remove();
    this.currentPosition = null;
    this.isBeingHidden = false;
  }
  
  hideImmediately() {
    this.image.remove();
    this.isVisible = false;
    this.isBeingHidden = false;
    this.currentPosition = null;
  }
  
  checkHit(cellIndex) {
    return this.isVisible && 
           !this.isBeingHidden && 
           cellIndex === this.currentPosition;
  }
  
  hit() {
    this.image.classList.add('hit-animation');
    setTimeout(() => {
      this.image.classList.remove('hit-animation');
    }, 300);
  }
  
  getCurrentPosition() {
    return this.currentPosition;
  }
  
  canAppearInPosition(position) {
    return position !== this.lastPosition;
  }
  
  resetPositionHistory() {
    this.lastPosition = null;
  }
}