import { MODES } from '@avo/misc/constants';

class InteractionMode {
  constructor (app) {
    this._app = app;
    
    this.html = document.getElementById('interaction-mode');
  }
  
  load () {
    this.html.className = 'active';
    
    // TEST
    this.emptyHtml();
    const closeButton = document.createElement('button');
    closeButton.textContent = 'CLOSE';
    closeButton.onclick = () => {
      this._app.changeMode(MODES.ACTION);
    }
    this.addHtml(closeButton);
    
    this.focus();
  }
  
  unload () {
    this.html.className = '';
  }
  
  focus () {
    // TEST
    const buttons = this.html.getElementsByTagName('button');
    if (buttons[0]) {
      buttons[0].focus();
    }
  }
  
  addHtml (node) {
    this.html.appendChild(node);
  }
  
  emptyHtml () {
    while (this.html.firstChild) { this.html.removeChild(this.html.firstChild) }
  }
}

export default InteractionMode;
