import { MODES } from '@avo/misc/constants';

class Interaction {
  constructor (app) {
    this._app = app;
  }
  
  load () {
    const container = this._app.interactionMode;

    container.empty();
    
    const panel = document.createElement('div');
    panel.className = 'simple interaction';
    container.add(panel);
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'CLOSE';
    closeButton.onclick = () => {
      this._app.changeMode(MODES.ACTION);
    }
    panel.appendChild(closeButton);
    
  }
  
  unload () {
    const container = this._app.interactionMode;
    this.container.empty();
  }
  
  focus () {
    const container = this._app.interactionMode;
    const buttons = container.html.getElementsByTagName('button');
    if (buttons[0]) {
      buttons[0].focus();
    }
  }
}

export default Interaction;