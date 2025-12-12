export default class NotificationManager {
  constructor() {
    this.overlay = null;
    this.notification = null;
    this.title = null;
    this.message = null;
    this.button = null;
    
    this.createNotificationUI();
  }
  
  createNotificationUI() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'gameOverlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    
    this.notification = document.createElement('div');
    this.notification.id = 'gameNotification';
    this.notification.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `;
    
    this.title = document.createElement('h2');
    this.title.id = 'notificationTitle';
    this.title.style.cssText = `
      margin: 0 0 20px 0;
      font-size: 28px;
      font-weight: bold;
    `;
    
    this.message = document.createElement('div');
    this.message.id = 'notificationMessage';
    this.message.style.cssText = `
      font-size: 18px;
      margin-bottom: 25px;
      line-height: 1.5;
    `;
    
    this.button = document.createElement('button');
    this.button.id = 'notificationButton';
    this.button.style.cssText = `
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 30px;
      font-size: 18px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s, background 0.2s;
    `;
    
    this.notification.append(this.title, this.message, this.button);
    this.overlay.append(this.notification);
    document.body.append(this.overlay);
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.append(style);
  }
  
  show(titleText, messageText, buttonText = 'Новая игра', onButtonClick = null) {
    this.title.textContent = titleText;
    this.message.textContent = messageText;
    this.button.textContent = buttonText;
    
    const newButton = this.button.cloneNode(true);
    this.button.replaceWith(newButton);
    this.button = newButton;
    
    if (onButtonClick) {
      this.button.addEventListener('click', onButtonClick);
    }
    
    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'scale(1.05)';
    });
    
    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = 'scale(1)';
    });
    
    this.overlay.style.display = 'flex';
  }
  
  hide() {
    this.overlay.style.display = 'none';
  }
  
  setButtonText(text) {
    this.button.textContent = text;
  }
}