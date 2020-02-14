import Interaction from '@avo/interactions';

class InteractionMode {
  constructor (app) {
    this._app = app;
    
    this.html = document.getElementById('interaction-mode');
    this.interaction = new Interaction(this._app);
  }
  
  load () {
    this.html.className = 'active';    
    this.interaction && this.interaction.load();
    this.focus();
  }
  
  unload () {
    this.html.className = '';
  }
  
  focus () {
    this.interaction && this.interaction.focus();
  }
  
  add (node) {
    this.html.appendChild(node);
  }
  
  empty () {
    while (this.html.firstChild) { this.html.removeChild(this.html.firstChild) }
  }
}

export default InteractionMode;
