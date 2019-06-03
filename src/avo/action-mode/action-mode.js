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
    Object.keys(app.actors).forEach((id) => {
      const actor = app.actors[id];
      actor.play(app);
    })
  }
  
  paint (app) {
    const canvas2d = this.canvas2d;
    
    // Clear canvas before painting
    canvas2d.clearRect(0, 0, this.width, this.height);
    
    Object.keys(app.actors).forEach((actorId) => {
      app.actors[actorId].paint(app);
    });
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (app, e) {
    if (!this.keysPressed[e.key])
      this.keysPressed[e.key] = 1;
    else
      this.keysPressed[e.key]++;
    
    // TEMP: move Player
    /*const speed = 1;
    switch (e.key) {
      case 'ArrowRight':
        app.playerActor.x += speed;
        break;
      case 'ArrowDown':
        app.playerActor.y += speed;
        break;
      case 'ArrowLeft':
        app.playerActor.x -= speed;
        break;
      case 'ArrowUp':
        app.playerActor.y -= speed;
        break;
    }*/
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
      
      if (moveX || moveY) {
        playerActor.intent = { name: 'move', x: moveX, y: moveY };
      }
    }
    
  }
}

export default ActionMode;
