import dwarfImage from './images/goblin.png';
import Board from "./Board";
import Goblin from "./Goblin";
import Timer from "./Timer";
import ScoreManager from "./ScoreManager";
import HammerCursor from "./HammerCursor";
import NotificationManager from "./NotificationManager";

export default class Game {
  constructor() {
    this.board = new Board(4);
    this.goblin = new Goblin(dwarfImage);
    this.scoreManager = new ScoreManager();
    this.timer = new Timer(60);
    this.cursor = new HammerCursor();
    this.notificationManager = new NotificationManager();
    
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
    this.setupEventListeners();
    this.updateUI();
    
    this.cursor.attach();
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
      return;
    }
    this.lastClickTime = now;

    const cell = e.target.closest('.cell');
    if (!cell) return;

    e.stopPropagation();
    
    this.cursor.hit();
    
    this.handleCellClick(cell);
  }

  start() {
    if (this.gameActive) return;

    if (this.gameOver) {
      this.reset();
    }

    this.gameActive = true;
    this.gameOver = false;
    this.startButton.textContent = 'Пауза';
    this.startButton.classList.add('btn-secondary');

    this.cursor.show();
    
    document.body.classList.add('game-active');

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
    
    this.cursor.hide();
    document.body.classList.remove('game-active');
  }

  reset() {
    this.gameActive = false;
    this.gameOver = false;
    this.missedGoblins = 0;
    this.scoreManager.reset();
    this.timer.reset();
    
    this.board.resetPositionHistory();
    this.goblin.resetPositionHistory();

    this.startButton.textContent = 'Начать игру';
    this.startButton.classList.remove('btn-secondary');

    this.clearGoblinTimeout();
    this.goblin.hide();
    
    this.cursor.hide();
    document.body.classList.remove('game-active');
    
    this.updateUI();
    
    this.notificationManager.hide();
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
    
    this.goblin.show(position);

    this.currentGoblinTimeout = setTimeout(() => {
      this.handleMissedGoblin();
    }, 1000);
  }
  
  handleCellClick(cell) {
    const cellIndex = parseInt(cell.dataset.index);
    
    if (!this.goblin.isVisible) {
      return;
    }
    
    const isHit = this.goblin.checkHit ? 
                  this.goblin.checkHit(cellIndex) :
                  (cellIndex === this.goblin.getCurrentPosition());

    if (isHit) {
      this.handleGoblinHit();
    } else {
      this.handleMissedGoblin();
      
      cell.classList.add('miss');
      setTimeout(() => {
        cell.classList.remove('miss');
      }, 300);
    }
    
    setTimeout(() => {
      this.cursor.reset();
    }, 200);
  }

  handleGoblinHit() {
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
    this.clearGoblinTimeout();

    if (this.goblin.isVisible) {
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
    } else {
      console.log('Гоблин уже не виден, пропуск не засчитывается');
    }
  }
  
  endGame(message) {
    this.gameActive = false;
    this.gameOver = true;
    this.clearGoblinTimeout();

    this.startButton.textContent = 'Начать игру';
    this.startButton.classList.remove('btn-secondary');

    this.timer.pause();
    this.goblin.hide();
    
    this.cursor.hide();
    document.body.classList.remove('game-active');

    const score = this.scoreManager.getScore();
    
    this.notificationManager.show(
      'Игра окончена!',
      `${message}\n\nВы набрали ${score} очков!`,
      'Новая игра',
      () => {
        this.notificationManager.hide();
        this.reset();
      }
    );
    
    this.updateUI();
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