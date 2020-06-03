import { MODES, EXPECTED_TIMESTEP } from '@avo/misc/constants';
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
    
    // Keys that are currently being pressed.
    // Structure is: 
    // key_value: {
    //   pressed: true|false,
    //   duration: number,
    //   startAcknowledged: true|false,
    //   endAcknowledged: true|false,
    // }
    this.keysPressed = {};
  }
  
  load () {
    this.focus();    
  }
  
  unload () {
    this.resetKeysPressed();
  }
  
  focus () {
    this.html.focus();
  }
  
  play (timeStep) {
    const app = this._app;
    
    this.processPlayerInput();
    
    // Sort for visual rendering
    // TODO: check if this is necessary.
    function sortY (a, b) { return a.y - b.y }
    app.actors.sort(sortY);
    app.particles.sort(sortY);
    
    // Run logic for each Entity
    app.actors.forEach(actor => {
      actor.play(timeStep);
    });
    app.particles.forEach(particle => {
      particle.play(timeStep);
    });
    
    this.processPhysics(timeStep);
    
    // Camera Controls: focus the camera on the target actor, if any.
    if (app.camera.targetActor) {
      app.camera.x = this.width / 2 - app.camera.targetActor.x;
      app.camera.y = this.height / 2 - app.camera.targetActor.y;
    }
    
    // Open Escape menu
    if (this.keysPressed['Escape']?.pressed &&
        !this.keysPressed['Escape']?.startAcknowledged) {
      app.changeMode(MODES.INTERACTION);
      this.keysPressed['Escape'].startAcknowledged = true;
    }
    
    // Increment the duration of each currently pressed key
    Object.keys(this.keysPressed).forEach(key => {
      if (this.keysPressed[key].pressed) {
        this.keysPressed[key].duration += timeStep;
      }
    })
  }
  
  paint () {
    // TODO: see https://www.html5rocks.com/en/tutorials/canvas/hidpi/ about using window.devicePixelRatio to fix blurriness on a High DPI canvas
    
    const app = this._app;
    const canvas2d = this.canvas2d;
    const camera = app.camera;
    
    // Clear canvas before painting
    canvas2d.clearRect(0, 0, this.width, this.height);
    
    // Paint the map (floor)
    app.map && app.map.paint(canvas2d, camera, {});
    
    // Paint each Entity
    app.particles.forEach(particle => {
      particle.paint(canvas2d, camera, {});
    });
    app.actors.forEach(actor => {
      actor.paint(canvas2d, camera, {});
    });
    
  }
  
  focus () {
    this.html.focus();
  }
  
  onKeyDown (e) {
    const key = e.key;
    if (!key) return;
    
    // Initialise key record if needed
    if (!this.keysPressed[key]) {
      this.keysPressed[key] = {
        pressed: false,
        duration: 0,
        startAcknowledged: false,
        endAcknowledged: false,
      };
    }
    
    this.keysPressed[key].pressed = true;
    this.keysPressed[key].duration = 0;
    this.keysPressed[key].endAcknowledged = false;
    // Note: onKeyDown fires MULTIPLE TIMES for every second the key is down,
    // so don't reset startAcknowledged = false.
  }
  
  onKeyUp (e) {
    const key = e.key;
    if (!key) return;
    
    // Initialise key record if needed
    if (!this.keysPressed[key]) {
      this.keysPressed[key] = {
        pressed: false,
        duration: 0,
        startAcknowledged: false,
        endAcknowledged: false,
      };
    }
    
    this.keysPressed[key].pressed = false;
    this.keysPressed[key].startAcknowledged = false;
  }
  
  resetKeysPressed () {
    Object.keys(this.keysPressed).forEach((key) => {
      this.keysPressed[key].pressed = false;
      this.keysPressed[key].duration = 0;
      this.keysPressed[key].startAcknowledged = false;
      this.keysPressed[key].endAcknowledged = false;
    })
  }
  
  processPlayerInput () {
    const app = this._app;
    const playerActor = app.playerActor;
    
    if (playerActor) {
      playerActor.intent = undefined;
      
      let moveX = 0;
      let moveY = 0;
      
      if (this.keysPressed['ArrowRight']?.pressed) moveX++;
      if (this.keysPressed['ArrowDown']?.pressed) moveY++;
      if (this.keysPressed['ArrowLeft']?.pressed) moveX--;
      if (this.keysPressed['ArrowUp']?.pressed) moveY--;
      
      if (moveX || moveY) {
        playerActor.intent = {
          name: 'move',
          attr: {
            x: moveX,
            y: moveY,
          },
        };
      }
          
      ['z', 'Z', ' '].forEach(key => {
        if (this.keysPressed[key]?.pressed && !this.keysPressed[key]?.startAcknowledged) {
          playerActor.intent = {
            name: 'skill_1'
          };
          this.keysPressed[key].startAcknowledged = true
        }
      });
    
      ['x', 'X', 'Shift'].forEach(key => {
        if (this.keysPressed[key]?.pressed && !this.keysPressed[key]?.startAcknowledged) {
          playerActor.intent = {
            name: 'skill_2'
          };
          this.keysPressed[key].startAcknowledged = true
        }
      });
      
      ['c', 'C'].forEach(key => {
        if (this.keysPressed[key]?.pressed && !this.keysPressed[key]?.startAcknowledged) {
          playerActor.intent = {
            name: 'skill_3'
          };
          this.keysPressed[key].startAcknowledged = true
        }
      });
    }
    
  }
  
  /*
  Run Physics logic, notably in regards to motion and collision.
  
  Note: we're simulating physics with discrete time intervals (i.e. video game
  frames-per-second) for simplicity, instead of calculating for continuous time
  (i.e. more realistic physics).
  
  Please don't expect too much mathematical realism here, but as long as the
  actual time interval (timeStep) matches the expected time interval, the video
  game logic will work.
  */
  processPhysics (timeStep) {
    const app = this._app;
    const timeCorrection = (timeStep / EXPECTED_TIMESTEP);
    
    // Move Actors and Particles
    app.actors.forEach(actor => {
      actor.x += actor.moveX * timeCorrection;
      actor.y += actor.moveY * timeCorrection;
      actor.x += actor.pushX * timeCorrection;
      actor.y += actor.pushY * timeCorrection;
      actor.pushX = 0;
      actor.pushY = 0;
    });
    app.particles.forEach(particle => {
      particle.x += particle.moveX * timeCorrection;
      particle.y += particle.moveY * timeCorrection;
      particle.x += particle.pushX * timeCorrection;
      particle.y += particle.pushY * timeCorrection;
      particle.pushX = 0;
      particle.pushY = 0;
    });
    
    // Check Map tiles
    const map = app.map;
    app.actors.forEach(actor => {
      let collisionCorrection = map.checkCollision(actor);
      if (collisionCorrection) {
        actor.x = collisionCorrection.x;
        actor.y = collisionCorrection.y;
      }
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
