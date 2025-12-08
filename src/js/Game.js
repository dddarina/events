import dwarfImage from './images/goblin.png';
import Board from "./Board";
import Goblin from "./Goblin";
import Timer from "./Timer";
import ScoreManager from "./ScoreManager";
import HammerCursor from "./HammerCursor";

export default class Game {
  constructor() {
    this.board = new Board(4);
    this.goblin = new Goblin(dwarfImage);
    this.scoreManager = new ScoreManager();
    this.timer = new Timer(60);
    this.cursor = new HammerCursor();
    this.missedGoblins = 0;
    this.maxMissed = 5;
    this.gameActive = false;
    this.currentGoblinTimeout = null;
    this.isProcessingClick = false;
    this.lastClickTime = 0;
    this.clickDebounceDelay = 200;
    this.gameOver = false; 

    this.startButton = document.getElementById('startBtn');
    this.resetButton = document.getElementById('resetBtn');

    this.init();
  }

  init() {
    this.board.render();
    this.cursor.attach();
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    this.startButton.addEventListener('click', () => {
      if (!this.gameActive) {
        this.start();
      } else {
        this.pause();
      }
    });

    this.resetButton.addEventListener('click', () => this.reset());

    this.board.element.addEventListener('mousedown', (e) => {
      this.handleBoardMouseDown(e);
    });
  }

  handleBoardMouseDown(e) {
    if (!this.gameActive) return;

    const now = Date.now();
    if (now - this.lastClickTime < this.clickDebounceDelay) {
      console.log('Слишком быстрый клик, игнорируем');
      return;
    }
    this.lastClickTime = now;

    const cell = e.target.closest('.cell');
    if (!cell) return;

    e.stopPropagation();
    
    this.handleCellClick(cell);
  }

  start() {
    if (this.gameActive) return;

    if (this.gameOver) {
      this.missedGoblins = 0;
      this.scoreManager.reset();
      this.gameOver = false;
    }

    this.gameActive = true;
    this.startButton.textContent = 'Пауза';
    this.startButton.classList.add('btn-secondary');

    this.timer.start(() => {
      this.endGame('Время вышло!');
    });

    this.scheduleNextGoblin();
  }

  pause() {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.startButton.textContent = 'Продолжить';
    this.startButton.classList.remove('btn-secondary');

    this.timer.pause();
    this.clearGoblinTimeout();
    this.goblin.hide();
  }

  reset() {
    this.gameActive = false;
    this.gameOver = false; 
    this.missedGoblins = 0;
    this.scoreManager.reset();
    this.timer.reset();

    this.startButton.textContent = 'Начать игру';
    this.startButton.classList.remove('btn-secondary');

    this.clearGoblinTimeout();
    this.goblin.hide();
    this.updateUI();
  }

  scheduleNextGoblin() {
    if (!this.gameActive) return;

    this.clearGoblinTimeout();

    const delay = 500 + Math.random() * 1000;

    setTimeout(() => {
      if (!this.gameActive) return;
      this.showNextGoblin();
    }, delay);
  }

  showNextGoblin() {
    if (!this.gameActive) return;

    const position = this.board.getRandomPosition();
    console.log(`Показываем гоблина в ячейке ${position} в ${Date.now()}`);
    
    this.goblin.show(position);

    this.currentGoblinTimeout = setTimeout(() => {
      console.log(`Таймер пропуска сработал для ${position} в ${Date.now()}`);
      this.handleMissedGoblin();
    }, 1000);
  }
  
  handleCellClick(cell) {
    const cellIndex = parseInt(cell.dataset.index);
    
    if (!this.goblin.isVisible) {
      console.log('Клик по пустой ячейке - гоблин не виден');
      return; 
    }
    
    const isHit = this.goblin.checkHit ? 
                  this.goblin.checkHit(cellIndex) :
                  (cellIndex === this.goblin.getCurrentPosition());

    console.log('Обработка клика по ячейке:', cellIndex, 
                'Гоблин в:', this.goblin.getCurrentPosition(),
                'Попадание:', isHit);

    if (isHit) {
      console.log('Попадание! Засчитываем очко');
      this.handleGoblinHit();
    } else {
      console.log('Промах - клик мимо гоблина');
      cell.classList.add('miss');
      setTimeout(() => {
        cell.classList.remove('miss');
      }, 300);
    }
  }

  handleGoblinHit() {
    console.log('Обработка попадания...');

    this.clearGoblinTimeout();

    this.goblin.hit();

    this.scoreManager.increase();

    setTimeout(() => {
      this.goblin.hide();

      if (this.gameActive) {
        this.scheduleNextGoblin();
      }
    }, 200);

    this.updateUI();
  }

  handleMissedGoblin() {
    if (!this.goblin.isVisible) {
      console.log('Гоблин уже не виден, пропуск не засчитывается');
      return;
    }

    console.log('Пропущен гоблин! Всего пропущено:', this.missedGoblins + 1);

    this.missedGoblins++;
    this.goblin.hide();

    if (this.missedGoblins >= this.maxMissed) {
      this.endGame('Пропущено 5 гоблинов! Игра окончена!');
      return;
    }

    this.updateUI();

    if (this.gameActive) {
      this.scheduleNextGoblin();
    }
  }
  
  endGame(message) {
    this.gameActive = false;
    this.gameOver = true; 
    this.clearGoblinTimeout();

    this.startButton.textContent = 'Начать игру';
    this.startButton.classList.remove('btn-secondary');

    this.timer.pause();
    this.timer.reset(); 
    this.goblin.hide();

    this.updateUI(); 

    setTimeout(() => {
      alert(`${message} Вы набрали ${this.scoreManager.getScore()} очков!`);
    }, 100);
  }

  clearGoblinTimeout() {
    if (this.currentGoblinTimeout) {
      clearTimeout(this.currentGoblinTimeout);
      this.currentGoblinTimeout = null;
    }
  }

  updateUI() {
    this.scoreManager.updateDisplay();
    this.timer.updateDisplay();

    const missedElement = document.getElementById('missed');
    if (missedElement) {
      missedElement.textContent = `${this.missedGoblins}/${this.maxMissed}`;
      
      if (this.missedGoblins >= 3) {
        missedElement.style.color = '#ff9800';
      }
      if (this.missedGoblins >= 4) {
        missedElement.style.color = '#f44336';
      }
      if (this.missedGoblins < 3) {
        missedElement.style.color = '#2196F3';
      }
    }

    console.log('Счет:', this.scoreManager.getScore(), 'Пропущено:', this.missedGoblins);
  }
}