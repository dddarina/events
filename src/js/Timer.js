export default class Timer {
  constructor(initialTime) {
    this.initialTime = initialTime;
    this.timeLeft = initialTime;
    this.element = document.getElementById('time');
    this.timerInterval = null;
    this.isRunning = false;
  }
  
  start(onComplete) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.pause();
        if (onComplete) onComplete();
      }
    }, 1000);
  }
  
  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
  
  reset() {
    this.pause();
    this.timeLeft = this.initialTime;
    this.updateDisplay();
  }
  
  updateDisplay() {
    if (this.element) {
      this.element.textContent = this.timeLeft;
    }
  }
}