export default class ScoreManager {
  constructor() {
    this.score = 0;
    this.element = document.getElementById('score');
  }
  
  increase() {
    this.score++;
    this.animate();
  }
  
  reset() {
    this.score = 0;
    this.updateDisplay();
  }
  
  getScore() {
    return this.score;
  }
  
  updateDisplay() {
    if (this.element) {
      this.element.textContent = this.score;
    }
  }
  
  animate() {
    this.element.classList.add('score-animation');
    
    setTimeout(() => {
      this.element.classList.remove('score-animation');
    }, 300);
    
    this.updateDisplay();
  }
}