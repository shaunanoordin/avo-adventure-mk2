import { ACTION_TYPES, EFFECTS_STACKING, MODES, SHAPES } from '@avo/misc/constants';
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
      acceleration: 1,
      deceleration: 1,
      maxSpeed: 8,
    };
    
    this.intent = undefined;
    this.actionName = 'idle';
    this.actionAttr = {};
    this.actionStep = 0;
    this.actions = {
      'idle': {
        type: ACTION_TYPES.IDLE,
        steps: 1,
        script: function (app, actor, action, actionAttr, step) {
          actor.animationFrame = 'idle';
        }
      },
      'move': {
        type: ACTION_TYPES.CONTINUOUS,
        steps: 6 * 8,
        script: function (app, actor, action, actionAttr, step) {
          const acceleration = actor.stats.acceleration || 0;
          
          const actionRotation = Math.atan2(actionAttr.y, actionAttr.x);
          let moveX = actor.moveX + acceleration * Math.cos(actionRotation);
          let moveY = actor.moveY + acceleration * Math.sin(actionRotation);
          
          if (actor.stats.maxSpeed >= 0) {
            const maxSpeed = actor.stats.maxSpeed;
            const correctedSpeed = Math.min(maxSpeed, Math.sqrt(moveX * moveX + moveY * moveY));
            const moveRotation = Math.atan2(moveY, moveX);
            moveX = correctedSpeed * Math.cos(moveRotation);
            moveY = correctedSpeed * Math.sin(moveRotation);
          }
          
          actor.moveX = moveX;
          actor.moveY = moveY;
          actor.rotation = actionRotation;
          
          if (0 * 8 <= step && step < 1 * 8) actor.animationFrame = 'move-1';
          else if (1 * 8 <= step && step < 3 * 8) actor.animationFrame = 'move-2';
          else if (3 * 8 <= step && step < 4 * 8) actor.animationFrame = 'move-1';
          else if (4 * 8 <= step && step < 6 * 8) actor.animationFrame = 'move-3';
        },
      },
      'attack': {
        type: ACTION_TYPES.STANDARD,
        steps: 15,
        script: function (app, actor, action, actionAttr, step) {
          if (step < 10) {

            actor.animationFrame = 'attack-windup';

          } else if (step === 10) {
            
            const particle = new Particle(app, {
              x: actor.x + Math.cos(actor.rotation) * actor.size * 0.8,
              y: actor.y + Math.sin(actor.rotation) * actor.size * 0.8,
              size: actor.size * 1,
              duration: 5,
              source: actor,
              ignoreSource: true,
              stats: {
                attackPower: 20,
                pushPower: 8,
                pushAngle: actor.rotation,
                pushDuration: 6,
                pushDecay: 1,
              },
              scripts: {
                'collision': function (app, particle, target) {
                  if (target && target.stats) {
                    target.stats.health = Math.max((target.stats.health || 0) - particle.stats.attackPower, 0);
                    
                    particle.applyEffect({
                      name: 'push',
                      attr: {
                        power: particle.stats.pushPower,
                        angle: particle.stats.pushAngle,
                        decay: particle.stats.pushDecay,
                      },
                      duration: particle.stats.pushDuration,
                      stacking: EFFECTS_STACKING.STACK,
                    }, target);
                    
                  }
                },
              },
            });
            app.particles.push(particle);
            
            actor.animationFrame = 'attack-active';
            
          } else {
            
            actor.animationFrame = 'attack-windown';
            
          }
        }
      },
      
    };
    
    this.scripts = {
      'always': function (app, actor) {},
      'damage': function (app, actor, effect) {},
      'push': function (app, actor, effect) {
        const power = effect.attr && effect.attr.power || 0;
        const angle = effect.attr && effect.attr.angle || 0;
        actor.pushX += power * Math.cos(angle);
        actor.pushY += power * Math.sin(angle);
        
        if (effect.attr.decay && effect.attr.power) {
          effect.attr.power = Math.max(effect.attr.power - effect.attr.decay, 0);
        }
      },
    };
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play () {
    const app = this._app;
    
    // Run script: "always execute on every frame"
    this.scripts.always && this.scripts.always(app, this);
    
    // TODO: copy processEffects to Particles, too.
    
    this.processEffects();
    this.processIntent();
    this.processActions();
    
    // TODO // TEMP - move this into this.scripts.always() ?
    if (this.stats.health < 100) { this.stats.health += 0.05 }
    
    // Upkeep: deceleration
    if (this.actionName !== 'move') {
      const deceleration = this.stats.deceleration || 0;
      const curRotation = Math.atan2(this.moveY, this.moveX)
      const curMoveSpeed = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
      const newMoveSpeed = Math.max(0, curMoveSpeed - deceleration);

      this.moveX = newMoveSpeed * Math.cos(curRotation);
      this.moveY = newMoveSpeed * Math.sin(curRotation);
    }
  }
  
  paint () {
    // TODO: see https://www.html5rocks.com/en/tutorials/canvas/hidpi/ about using window.devicePixelRatio to fix blurriness on a High DPI canvas
    
    // TODO: this should just move the animation frame one step. Add getSprite() for sprite logic, which will be called in ActionMode.
    
    const app = this._app;
    const camera = app.camera;
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // --------
    // Temporary 'animation'
    if (this.animationFrame === 'idle') canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';
    else if (this.animationFrame === 'move-1') canvas2d.fillStyle = 'rgba(0, 128, 128, 0.5)';
    else if (this.animationFrame === 'move-2') canvas2d.fillStyle = 'rgba(0, 160, 128, 0.5)';
    else if (this.animationFrame === 'move-3') canvas2d.fillStyle = 'rgba(0, 128, 160, 0.5)';
    else if (this.animationFrame === 'attack-windup') canvas2d.fillStyle = 'rgba(192, 192, 0, 0.5)';
    else if (this.animationFrame === 'attack-active') canvas2d.fillStyle = 'rgba(255, 0, 0, 0.5)';
    else if (this.animationFrame === 'attack-winddown') canvas2d.fillStyle = 'rgba(192, 128, 0, 0.5)';
    //--------
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
    
    // Paint UI elements
    let healthOffsetY = 7;
    const healthRatio = (this.stats.maxHealth > 0)
      ? (this.stats.health || 0) / this.stats.maxHealth
      : 0;
    canvas2d.strokeStyle = 'rgba(0, 0, 0)';
    canvas2d.lineWidth = 4;
    canvas2d.beginPath();
    canvas2d.moveTo(this.x - this.size / 3,
                    this.y + this.size / 2 + healthOffsetY);
    canvas2d.lineTo(this.x + this.size / 3,
                    this.y + this.size / 2 + healthOffsetY);
    canvas2d.stroke();
    canvas2d.strokeStyle = 'rgba(255, 0, 0)';
    canvas2d.lineWidth = 2;
    canvas2d.beginPath();
    canvas2d.moveTo(this.x - (this.size / 3 * healthRatio),
                    this.y + this.size / 2 + healthOffsetY);
    canvas2d.lineTo(this.x + (this.size / 3 * healthRatio),
                    this.y + this.size / 2 + healthOffsetY);
    canvas2d.stroke();
    
    healthOffsetY = 4;
    canvas2d.font = '8px Arial';
    canvas2d.fillStyle = 'rgba(204, 68, 68)';    
    canvas2d.textBaseline = 'hanging';
    canvas2d.textAlign = 'right';
    canvas2d.fillText('❤️', this.x - this.size / 3, this.y + this.size / 2 + healthOffsetY);
    canvas2d.textAlign = 'left';
    canvas2d.fillText(Math.floor(this.stats.health), this.x + this.size / 3, this.y + this.size / 2 + healthOffsetY);
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
        // Reset the actionStep counter if that's the case.
        if (this.actionName !== this.intent.name) {
          this.actionStep = 0;
        }
        
        // Finally, convert the intent into the new action.
        this.actionName = this.intent.name;
        this.actionAttr = (this.intent.attr) ? { ...this.intent.attr } : {};
      }
      
    }
    
  }
  
  goIdle () {
    this.actionName = 'idle';
    this.actionStep = 0;
    this.actionAttr = {};
  }
  
  processEffects () {
    const app = this._app;
    
    this.effects.forEach(effect => {
      const script = this.scripts[effect.name];
      script && script(app, this, effect)
      effect.duration --;
    })
    
    this.effects = this.effects.filter(effect => effect.duration > 0);
  }
  
  processActions () {
    const app = this._app;
    const action = this.actions[this.actionName]
    if (!action) return;
    
    action.script(app, this, action, this.actionAttr, this.actionStep);
    
    this.actionStep += 1;
    
    if (this.actionStep >= action.steps) {  // Is the action over?
      this.actionStep = 0;
      
      // If it's over (and doesn't loop), revert to default.
      if (action.type === ACTION_TYPES.STANDARD || action.type === ACTION_TYPES.SPECIAL_ONCE) {
        this.goIdle();
      }
    }
  }  
}

export default Actor;
