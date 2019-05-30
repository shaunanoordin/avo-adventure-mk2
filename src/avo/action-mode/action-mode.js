class ActionMode {
  constructor (app) {
    this.html = document.getElementById('action-mode');
    this.width = 320;
    this.height = 240;
    this.canvas2d = this.html.getContext("2d");
    
    // Set HTML
    console.log(this.html);
    this.html.width = this.width;
    this.html.height = this.height;
    this.canvasSizeRatio = 1;

    this.html.onkeydown = this.onKeyDown.bind(this, app);
    this.html.onkeyup = this.onKeyUp.bind(this, app);
  }
  
  load (app) {
    this.focus();    
  }
  
  unload (app) {}
  
  focus () {
    this.html.focus();
  }
  
  play (app) {
    
  }
  
  paint (app) {
    const canvas2d = this.canvas2d;
    
    // Clear canvas before painting
    canvas2d.clearRect(0, 0, this.width, this.height);
    
    Object.keys(app.actors).forEach((actorId) => {
      app.actors[actorId].paint(app);
    });
    
    // const assets = app.assets;
    // canvas2d.drawImage(assets.basicActor.img, 0, 0, 48, 48, 0, 0, 48, 48);
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (app, e) {
    // TEMP: move Player
    const speed = 1;
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
    }
  }
  
  onKeyUp (app, e) {
    
  }
}

export default ActionMode;
