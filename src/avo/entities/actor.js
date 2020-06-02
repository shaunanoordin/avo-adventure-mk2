import { ACTION_TYPES, SHAPES } from '@avo/misc/constants';
import { STANDARD_ACTIONS } from '@avo/actions';
import { STANDARD_REACTIONS } from '@avo/reactions';
import { STANDARD_ANIMATIONS } from '@avo/animations';
import Entity from './entity';
import Particle from './particle';

class Actor extends Entity {
  constructor (app, initialValues = {}) {
    super(app);
    
    this.shape = SHAPES.CIRCLE;
    this.solid = true;
    this.movable = true;
    
    this.moveAcceleration = 60;
    this.moveDeceleration = 60;
    this.moveMaxSpeed = 4;
    
    this.attr = {
      health: 100,  // TEMP
      maxHealth: 100,  // TEMP
      
      ACT: 3,  // Action stat
      DEF: 3,  // Defence stat
      SPR: 3,  // Spirit stat
      
      DMG: 0,  // Damage 
      DMG_recovery: 0,
      STN: 0,  // Stun
      STN_recovery: 0,
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
    
    this.reactions = {
      'damage': STANDARD_REACTIONS.DAMAGE,
      'push': STANDARD_REACTIONS.PUSH,
    };
    
    this.animationScript = STANDARD_ANIMATIONS.ACTOR;
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play (timeStep) {
    super.play(timeStep);
    
    const app = this._app;
    
    this.processIntent();
    this.processActions(timeStep);
    
    if (this.attr.health <= 0) { this._expired = true }
    if (this.attr.health < this.attr.maxHealth) { this.attr.health += 0.05 }
    
    // Upkeep: deceleration
    if (this.actionName !== 'move') {
      const moveDeceleration = this.moveDeceleration * timeStep / 1000 || 0;
      const curRotation = Math.atan2(this.moveY, this.moveX)
      const curMoveSpeed = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
      const newMoveSpeed = Math.max(0, curMoveSpeed - moveDeceleration);

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
  
  processActions (timeStep) {
    const app = this._app;
    const action = this.actions[this.actionName]
    if (!action) return;
    
    const progress = (action.duration > 0) ? this.actionCounter / action.duration : 0;
    action.script({ app, entity: this, action, actionAttr: this.actionAttr, progress, timeStep });
    
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
