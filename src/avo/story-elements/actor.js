import { ACTION_TYPES, SHAPES } from '@avo/misc/constants';
import { STANDARD_ACTIONS } from '@avo/actions';
import { STANDARD_REACTIONS } from '@avo/reactions';
import { STANDARD_ANIMATIONS } from '@avo/animations';
import StoryElement from './story-element';
import Particle from './particle';

class Actor extends StoryElement {
  constructor (app, initialValues = {}) {
    super(app);
    
    this.shape = SHAPES.CIRCLE;
    this.solid = true;
    this.movable = true;
    
    this.stats = {
      health: 100,  // TEMP
      maxHealth: 100,  // TEMP
      acceleration: 60,
      deceleration: 60,
      maxSpeed: 4,
    };
    
    this.intent = undefined;
    this.actionName = 'idle';
    this.actionAttr = {};
    this.actionCounter = 0;
    this.actions = {
      'idle': STANDARD_ACTIONS.IDLE,
      'move': STANDARD_ACTIONS.MOVE,
      'attack': STANDARD_ACTIONS.ATTACK,
      'dash': STANDARD_ACTIONS.DASH,
    };
    
    this.scripts = {
      'always': function ({ app, actor, timeStep }) {},
    };
    
    this.reactions = {
      'damage': STANDARD_REACTIONS.DAMAGE,
      'push': STANDARD_REACTIONS.PUSH,
    };
    
    this.animationScript = STANDARD_ANIMATIONS.ACTOR;
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play (timeStep) {
    const app = this._app;
    
    // Run script: "always execute on every frame"
    this.scripts.always && this.scripts.always({ app, element: this, timeStep });
    
    // TODO: copy processEffects to Particles, too.
    
    this.processEffects(timeStep);
    this.processIntent();
    this.processActions(timeStep);
    
    // TODO // TEMP - move this into this.scripts.always() ?
    if (this.stats.health <= 0) { this._expired = true }
    if (this.stats.health < this.stats.maxHealth) { this.stats.health += 0.05 }
    
    // Upkeep: deceleration
    if (this.actionName !== 'move') {
      const deceleration = this.stats.deceleration * timeStep / 1000 || 0;
      const curRotation = Math.atan2(this.moveY, this.moveX)
      const curMoveSpeed = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
      const newMoveSpeed = Math.max(0, curMoveSpeed - deceleration);

      this.moveX = newMoveSpeed * Math.cos(curRotation);
      this.moveY = newMoveSpeed * Math.sin(curRotation);
    }
  }
  
  processIntent () {
    // Translate intent into action.
    
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
        // Reset the actionCounter if that's the case.
        if (this.actionName !== this.intent.name) {
          this.actionCounter = 0;
        }
        
        // Finally, convert the intent into the new action.
        this.actionName = this.intent.name;
        this.actionAttr = (this.intent.attr) ? { ...this.intent.attr } : {};
      }
      
    }
    
  }
  
  goIdle () {
    this.actionName = 'idle';
    this.actionCounter = 0;
    this.actionAttr = {};
  }
  
  processEffects (timeStep) {
    const app = this._app;
    
    this.effects.forEach(effect => {
      const reaction = this.reactions[effect.name] || {};
      
      // For each active Effect, run a reaction.
      if (effect.duration > 0) {
        reaction.always && reaction.always({ app, element: this, effect, timeStep});
      }
      
      // Effects should decay (unless duration === Infinity, of course) 
      effect.duration -= timeStep;
      
      // Prepare to end any old effects.
      if (effect.duration <= 0) reaction.onRemove && reaction.onRemove({ app, element: this, effect });
    });
    
    // Remove old effects
    this.effects = this.effects.filter(effect => effect.duration > 0);
  }
  
  processActions (timeStep) {
    const app = this._app;
    const action = this.actions[this.actionName]
    if (!action) return;
    
    const completion = (action.duration > 0) ? this.actionCounter / action.duration : 0;
    action.script({ app, element: this, action, actionAttr: this.actionAttr, completion, timeStep });
    
    this.actionCounter += timeStep;
    
    if (this.actionCounter >= action.duration) {  // Is the action over?
      this.actionCounter = 0;
      
      // If it's over (and doesn't loop), revert to default.
      if (action.type === ACTION_TYPES.STANDARD || action.type === ACTION_TYPES.SPECIAL_ONCE) {
        this.goIdle();
      }
    }
  }  
}

export default Actor;
