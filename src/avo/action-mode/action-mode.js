import { SHORT_KEYPRESS_DURATION } from '@avo/misc/constants';

class ActionMode {
  constructor (app) {
    this.html = document.getElementById('action-mode');
    this.width = 320;
    this.height = 240;
    this.canvas2d = this.html.getContext("2d");
    
    // Set HTML
    this.html.width = this.width;
    this.html.height = this.height;
    this.canvasSizeRatio = 1;

    this.html.onkeydown = this.onKeyDown.bind(this, app);
    this.html.onkeyup = this.onKeyUp.bind(this, app);
    
    // Keys that are currently being pressed, and the number of frames they've
    // been pressed for.
    this.keysPressed = {};
  }
  
  load (app) {
    this.focus();    
  }
  
  unload (app) {}
  
  focus () {
    this.html.focus();
  }
  
  play (app) {
    this.processPlayerInput(app);
    
    // Run logic for each Story Element
    Object.keys(app.actors).forEach(id => {
      const actor = app.actors[id];
      actor.play(app);
    });
    app.particles.forEach(particle => {
      particle.play(app);
    });
    
    // Increment the duration of each currently pressed key
    Object.keys(this.keysPressed).forEach(key => {
      if (this.keysPressed[key]) this.keysPressed[key]++;
    })
  }
  
  paint (app) {
    const canvas2d = this.canvas2d;
    
    // Clear canvas before painting
    canvas2d.clearRect(0, 0, this.width, this.height);
    
    // Paint each Story Element
    app.particles.forEach(particle => {
      particle.paint(app);
    });
    Object.keys(app.actors).forEach(actorId => {
      app.actors[actorId].paint(app);
    });
    
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (app, e) {
    if (!this.keysPressed[e.key]) this.keysPressed[e.key] = 1;
  }
  
  onKeyUp (app, e) {
    this.keysPressed[e.key] = undefined;
  }
  
  processPlayerInput(app) {
    const playerActor = app.playerActor;
    
    if (playerActor) {
      playerActor.intent = undefined;
      
      let moveX = 0;
      let moveY = 0;
      
      if (this.keysPressed['ArrowRight']) moveX++;
      if (this.keysPressed['ArrowDown']) moveY++;
      if (this.keysPressed['ArrowLeft']) moveX--;
      if (this.keysPressed['ArrowUp']) moveY--;
      
      if (this.keysPressed[' '] === SHORT_KEYPRESS_DURATION) {
        playerActor.intent = { name: 'primary' };
      } else if (moveX || moveY) {
        playerActor.intent = { name: 'move', x: moveX, y: moveY };
      }
    }
    
  }
}

export default ActionMode;
