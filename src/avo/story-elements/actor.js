import { MODES, SHAPES } from '@avo/misc/constants';
import StoryElement from './story-element';
import Particle from './particle';

const ACTION_TYPES = {
  IDLE: 'idle',  // Default. Loops.
  CONTINUOUS: 'continuous',  // Requires continuous input (e.g. moving). Loops until cancelled (e.g. user stops pressing arrow keys) or interrupted (e.g. by taking damage and going into the knockback state).
  STANDARD: 'standard',  // Actions that play out all their steps. Cannot be cancelled by new user input. Can be interrupted.
  SPECIAL_ONCE: 'special once',  // Actions that play out all their steps. Cannot be cancelled nor interrupted, except by story scripts.
  SPECIAL_FOREVER: 'special forever',  // Actions that play in a loop. Cannot be cancelled nor interrupted, except by story scripts.
};

class Actor extends StoryElement {
  constructor (app, initialValues = {}) {
    super(app);
    
    this.shape = SHAPES.CIRCLE;
    this.solid = true;
    this.movable = true;
    
    this.intent = undefined;
    this.actionName = 'idle';
    this.actionArgs = {};
    this.actionStep = 0;
    this.actions = {
      'idle': {
        type: ACTION_TYPES.IDLE,
        continuous: true,
        steps: 1,
        script: function (app, actor, action, actionArgs, step) {
          // TODO: playFrame: idle
        }
      },
      'move': {
        type: ACTION_TYPES.CONTINUOUS,
        continuous: true,
        steps: 6,
        script: function (app, actor, action, actionArgs, step) {
          const speed = 4; // TODO
          const rotation = Math.atan2(actionArgs.y, actionArgs.x);  // TODO
          actor.x += Math.cos(rotation) * speed;
          actor.y += Math.sin(rotation) * speed;
          actor.rotation = rotation;
          
          // TODO: playFrame: move-1, move-2, move-1, move-3
        },
      },
      'attack': {  //
        type: ACTION_TYPES.STANDARD,
        continuous: false,
        steps: 30,
        script: function (app, actor, action, actionArgs, step) {
          if (step < 20) {
            // TODO: playFrame: attack-windup
          } else if (step === 20) {
            const particle = new Particle(app, {
              x: actor.x + Math.cos(actor.rotation) * actor.size * 0.8,
              y: actor.y + Math.sin(actor.rotation) * actor.size * 0.8,
              size: actor.size * 1,
              duration: 5 * 30,
              // TODO: onCollision logic
            });
            app.particles.push(particle);
            
            // TODO: playFrame: attack-active
          } else {
            // TODO: playFrame: attack-winddown
          }
        }
      },
      
    };
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play () {
    const app = this._app;
    this.processUpkeep();
    this.processIntent();
    this.processActions();
  }
  
  paint () {
    // TODO: this should just move the animation frame one step. Add getSprite() for sprite logic, which will be called in ActionMode.
    
    const app = this._app;
    const camera = app.camera;
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';
    canvas2d.beginPath();
    canvas2d.arc(this.x + camera.x, this.y + camera.y, this.size / 2, 0, 2 * Math.PI);
    canvas2d.fill();
    
    // Simple direction
    canvas2d.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    canvas2d.lineWidth = 2;
    canvas2d.beginPath();
    canvas2d.moveTo(this.x, this.y);
    canvas2d.lineTo(this.x + Math.cos(this.rotation) * this.size * 0.6,
                    this.y + Math.sin(this.rotation) * this.size * 0.6);
    canvas2d.stroke();
    
    // Paint basic actor
    const assets = app.assets;
    const srcX = 0, srcY = 0;
    const srcSizeX = this.size, srcSizeY = this.size;
    const tgtX = Math.floor(this.x - srcSizeX / 2), tgtY = Math.floor(this.y - srcSizeY / 2);
    const tgtSizeX = Math.floor(this.size), tgtSizeY = Math.floor(this.size);
    canvas2d.drawImage(assets.basicActor.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
  }
  
  processUpkeep () {
    // TODO
  }
  
  processIntent () {
    // Translate intent into action.
    /*
    if (this.intent && this.intent.name === 'move' && this.checkStatus('can move')) {
      this.action = Object.assign({}, this.intent);
    } else if (this.checkStatus('can act')) {
      this.action = Object.assign({}, this.intent);
    } else {
      this.action = undefined;
    }*/
    
    const action = this.actions[this.actionName];
    
    if (!action) {  // Sanity check: if the Actor isn't doing anything, go idle.
      
      this.goIdle();
      // This is just a failsafe - the actor should ALWAYS have an action, even if it's the IDLE action.
      
    } else if (!this.intent) {  // If the Actor has no intent (e.g. player has no key input)...
      
      // ...cancel any currently cancellable actions.
      // (Obviously, ignore this if the 
      if (action.type === ACTION_TYPES.CONTINUOUS) this.goIdle();
      
    } else {  // Actor intends to perform a new action.
      
      // First, can the current action be overwritten by a new action?
      if (action.type === ACTION_TYPES.IDLE
          || action.type === ACTION_TYPES.CONTINUOUS) {

        // Second, check if the new action is different from the old one. 
        // Reset the actionStep counter if that's the case.
        if (this.actionName !== this.intent.name) {
          this.actionStep = 0;
        }
        
        // Finally, convert the intent into the new action.
        this.actionName = this.intent.name;
        this.actionArgs = (this.intent.args) ? { ...this.intent.args } : {};
      }
      
    }
    
  }
  
  goIdle () {
    this.actionName = 'idle';
    this.actionStep = 0;
    this.actionArgs = {};
  }
  
  processActions () {
    const app = this._app;
    const action = this.actions[this.actionName]
    if (!action) return;
    
    action.script(app, this, action, this.actionArgs, this.actionStep);
    
    this.actionStep += 1;
    
    if (this.actionStep >= action.steps) {  // Is the action over?
      this.actionStep = 0;
      
      // If it's over (and doesn't loop), revert to default.
      if (action.type === ACTION_TYPES.STANDARD || action.type === ACTION_TYPES.SPECIAL_ONCE) {
        this.goIdle();
      }
    }
    
    // TODO: move all these to a library
    /*
    if (this.action.name === 'move'
        && !(this.action.x === 0 && this.action.y === 0)
        && this.checkStatus('can move')) {
      const speed = 4; // TODO
      const rotation = Math.atan2(this.action.y, this.action.x);  // TODO
      this.x += Math.cos(rotation) * speed;
      this.y += Math.sin(rotation) * speed;
      this.rotation = rotation;
    }
    
    if (this.action.name === 'primary') {
      console.log('PEW PEW');
      const particle = new Particle(app, {
        x: this.x + Math.cos(this.rotation) * this.size * 0.8,
        y: this.y + Math.sin(this.rotation) * this.size * 0.8,
        size: this.size * 1,
        duration: 5 * 30
      });  // TODO
      app.particles.push(particle);
    }*/
  }  
}

export default Actor;
