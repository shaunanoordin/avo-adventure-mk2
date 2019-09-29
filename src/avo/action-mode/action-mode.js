import { MODES, SHORT_KEYPRESS_DURATION } from '@avo/misc/constants';
import { Physics } from '@avo/misc/physics';

class ActionMode {
  constructor (app) {
    this._app = app;
    
    this.html = document.getElementById('action-mode');
    this.width = 320;
    this.height = 240;
    this.canvas2d = this.html.getContext("2d");
    
    // Set HTML
    this.html.width = this.width;
    this.html.height = this.height;
    this.canvasSizeRatio = 1;

    this.html.onkeydown = this.onKeyDown.bind(this);
    this.html.onkeyup = this.onKeyUp.bind(this);
    
    // Keys that are currently being pressed, and the number of frames they've
    // been pressed for.
    this.keysPressed = {};
  }
  
  load () {
    this.focus();    
  }
  
  unload () {}
  
  focus () {
    this.html.focus();
  }
  
  play () {
    const app = this._app;
    
    this.processPlayerInput();
    
    // Sort for visual rendering
    // TODO: check if this is necessary.
    function sortY (a, b) { return a.y - b.y }
    app.actors.sort(sortY);
    app.particles.sort(sortY);
    
    // Run logic for each Story Element
    app.actors.forEach(actor => {
      actor.play();
    });
    app.particles.forEach(particle => {
      particle.play();
    });
    
    this.processPhysics();
    
    // Increment the duration of each currently pressed key
    Object.keys(this.keysPressed).forEach(key => {
      if (this.keysPressed[key]) this.keysPressed[key]++;
    })
    
    // Camera Controls: focus the camera on the target actor, if any.
    if (app.camera.targetActor) {
      app.camera.x = Math.floor(this.width / 2 - app.camera.targetActor.x);
      app.camera.y = Math.floor(this.height / 2 - app.camera.targetActor.y);
    }
  }
  
  paint () {
    // TODO: see https://www.html5rocks.com/en/tutorials/canvas/hidpi/ about using window.devicePixelRatio to fix blurriness on a High DPI canvas
    
    const app = this._app;
    const canvas2d = this.canvas2d;
    
    // Clear canvas before painting
    canvas2d.clearRect(0, 0, this.width, this.height);
    
    // Paint the map (floor)
    app.map && app.map.paint(MODES.ACTION, canvas2d, {});
    
    // Paint each Story Element
    app.particles.forEach(particle => {
      particle.paint(MODES.ACTION, canvas2d, {});
    });
    app.actors.forEach(actor => {
      actor.paint(MODES.ACTION, canvas2d, {});
    });
    
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (e) {
    if (!this.keysPressed[e.key]) this.keysPressed[e.key] = 1;
  }
  
  onKeyUp (e) {
    this.keysPressed[e.key] = undefined;
  }
  
  processPlayerInput() {
    const app = this._app;
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
        playerActor.intent = {
          name: 'attack'
        };
      } else if (moveX || moveY) {
        playerActor.intent = {
          name: 'move',
          attr: {
            x: moveX,
            y: moveY,
          },
        };
      }
    }
    
  }
  
  processPhysics () {
    const app = this._app;
    
    // Move Actors and Particles
    app.actors.forEach(actor => {
      actor.x += actor.moveX;
      actor.y += actor.moveY;
      actor.x += actor.pushX;
      actor.y += actor.pushY;
      actor.pushX = 0;
      actor.pushY = 0;
    });
    app.particles.forEach(particle => {
      particle.x += particle.moveX;
      particle.y += particle.moveY;
      particle.x += particle.pushX;
      particle.y += particle.pushY;
      particle.pushX = 0;
      particle.pushY = 0;
    });
    
    // Check Actor collisions
    for (let a = 0; a < app.actors.length; a++) {
      let actorA = app.actors[a];
      
      // ...with other Actors
      for (let b = a + 1; b < app.actors.length; b++) {
        let actorB = app.actors[b];
        let collisionCorrection = Physics.checkCollision(actorA, actorB);
                
        if (collisionCorrection) {
          actorA.x = collisionCorrection.ax;
          actorA.y = collisionCorrection.ay;
          actorB.x = collisionCorrection.bx;
          actorB.y = collisionCorrection.by;
          actorA.onCollision(actorB, collisionCorrection);
          actorB.onCollision(actorA, collisionCorrection);
        }
      }
    }
    
    // Check Particle collisions
    for (let a = 0; a < app.particles.length; a++) {
      let particleA = app.particles[a];
      
      // ...with other Particles
      for (let b = a + 1; b < app.particles.length; b++) {
        let particleB = app.particles[b];
        let collisionCorrection = Physics.checkCollision(particleA, particleB);
        
        if (collisionCorrection) {
          particleA.onCollision(particleB, collisionCorrection);
          particleB.onCollision(particleA, collisionCorrection);
        }
      }
      
      // ...with Actors
      for (let b = 0; b < app.actors.length; b++) {
        let actorB = app.actors[b];
        let collisionCorrection = Physics.checkCollision(particleA, actorB);
        
        if (collisionCorrection) {
          particleA.onCollision(actorB, collisionCorrection);
          actorB.onCollision(particleA, collisionCorrection);
        }
      }
    }
    
  }
  
}

export default ActionMode;
