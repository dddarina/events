export default class HammerCursor {
  constructor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'hammer-cursor';
    this.cursor.innerHTML = '🔨';
    this.isAttached = false;
  }
  
  attach() {
    if (this.isAttached) return;
    
    document.body.append(this.cursor);
    document.addEventListener('mousemove', this.updatePosition.bind(this));
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.addEventListener('mouseenter', () => {
      this.show();
    });
    
    gameBoard.addEventListener('mouseleave', () => {
      this.hide();
    });
    
    gameBoard.addEventListener('mousedown', () => {
      this.hit();
    });
    
    gameBoard.addEventListener('mouseup', () => {
      this.reset();
    });
    
    this.isAttached = true;
  }
  
  updatePosition(e) {
    this.cursor.style.left = `${e.clientX}px`;
    this.cursor.style.top = `${e.clientY}px`;
  }
  
  show() {
    this.cursor.style.display = 'block';
    
  }
  
  hide() {
    this.cursor.style.display = 'none';
    document.body.style.cursor = 'default';
  }
  
  hit() {
    this.cursor.classList.add('hammer-hit');
    this.cursor.innerHTML = '💥';
  }
  
  reset() {
    this.cursor.classList.remove('hammer-hit');
    this.cursor.innerHTML = '🔨';
  }
}