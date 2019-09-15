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
          actor.animationName = 'idle';
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
          
          if (0 * 8 <= step && step < 1 * 8) actor.animationName = 'move-1';
          else if (1 * 8 <= step && step < 3 * 8) actor.animationName = 'move-2';
          else if (3 * 8 <= step && step < 4 * 8) actor.animationName = 'move-1';
          else if (4 * 8 <= step && step < 6 * 8) actor.animationName = 'move-3';
        },
      },
      'attack': {
        type: ACTION_TYPES.STANDARD,
        steps: 15,
        script: function (app, actor, action, actionAttr, step) {
          if (step < 10) {

            actor.animationName = 'attack-windup';

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
              animationScript: function (app, element, canvas, options = {}) {
                const camera = app.camera;
                const layer = options.layer || '';

                if (!canvas) return;
                
                // Simple shadow
                canvas.fillStyle = 'rgba(238, 238, 204, 0.5)';
                canvas.beginPath();
                canvas.arc(element.x + camera.x, element.y + camera.y, element.size / 2, 0, 2 * Math.PI);
                canvas.fill();
              },
            });
            app.particles.push(particle);
            
            actor.animationName = 'attack-active';
            
          } else {
            
            actor.animationName = 'attack-windown';
            
          }
        }
      },
      
    };
    
    this.scripts = {
      'always': function (app, actor) {},
    };
    
    this.reactions = {
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
    
    this.animationScript = function (app, element, canvas, options = {}) {
      
      const camera = app.camera;
      const layer = options.layer || '';

      if (!canvas) return;

      // Simple shadow
      canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
      // --------
      // Temporary 'animation'
      if (element.animationName === 'idle') canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
      else if (element.animationName === 'move-1') canvas.fillStyle = 'rgba(0, 128, 128, 0.5)';
      else if (element.animationName === 'move-2') canvas.fillStyle = 'rgba(0, 160, 128, 0.5)';
      else if (element.animationName === 'move-3') canvas.fillStyle = 'rgba(0, 128, 160, 0.5)';
      else if (element.animationName === 'attack-windup') canvas.fillStyle = 'rgba(192, 192, 0, 0.5)';
      else if (element.animationName === 'attack-active') canvas.fillStyle = 'rgba(255, 0, 0, 0.5)';
      else if (element.animationName === 'attack-winddown') canvas.fillStyle = 'rgba(192, 128, 0, 0.5)';
      // --------
      canvas.beginPath();
      canvas.arc(element.x + camera.x, element.y + camera.y, element.size / 2, 0, 2 * Math.PI);
      canvas.fill();

      // Simple direction
      // --------
      canvas.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      canvas.lineWidth = 2;
      canvas.beginPath();
      canvas.moveTo(element.x, element.y);
      canvas.lineTo(element.x + Math.cos(element.rotation) * element.size * 0.6,
                      element.y + Math.sin(element.rotation) * element.size * 0.6);
      canvas.stroke();
      // --------

      // Paint actor sprite
      // --------
      if (this.animationSpritesheet) {
        const SPRITE_SIZE = 48;
        let SPRITE_OFFSET_X = 0;
        let SPRITE_OFFSET_Y = -8;

        const srcSizeX = SPRITE_SIZE;
        const srcSizeY = SPRITE_SIZE;
        const srcX = 0;
        const srcY = 0;

        const tgtSizeX = SPRITE_SIZE;
        const tgtSizeY = SPRITE_SIZE;
        const tgtX = Math.floor(element.x - srcSizeX / 2 + SPRITE_OFFSET_X);
        const tgtY = Math.floor(element.y - srcSizeY / 2 + SPRITE_OFFSET_Y);

        canvas.drawImage(this.animationSpritesheet.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
      }
      // --------

      // Paint UI elements
      // --------
      let healthOffsetY = 7;
      const healthRatio = (element.stats.maxHealth > 0)
        ? (element.stats.health || 0) / element.stats.maxHealth
        : 0;
      canvas.strokeStyle = 'rgba(0, 0, 0)';
      canvas.lineWidth = 4;
      canvas.beginPath();
      canvas.moveTo(element.x - element.size / 3,
                    element.y + element.size / 2 + healthOffsetY);
      canvas.lineTo(element.x + element.size / 3,
                    element.y + element.size / 2 + healthOffsetY);
      canvas.stroke();
      canvas.strokeStyle = 'rgba(255, 0, 0)';
      canvas.lineWidth = 2;
      canvas.beginPath();
      canvas.moveTo(element.x - (element.size / 3 * healthRatio),
                    element.y + element.size / 2 + healthOffsetY);
      canvas.lineTo(element.x + (element.size / 3 * healthRatio),
                    element.y + element.size / 2 + healthOffsetY);
      canvas.stroke();

      healthOffsetY = 4;
      canvas.font = '8px Arial';
      canvas.fillStyle = 'rgba(204, 68, 68)';    
      canvas.textBaseline = 'hanging';
      canvas.textAlign = 'right';
      canvas.fillText('❤️', element.x - element.size / 3, element.y + element.size / 2 + healthOffsetY);
      canvas.textAlign = 'left';
      canvas.fillText(Math.floor(element.stats.health), element.x + element.size / 3, element.y + element.size / 2 + healthOffsetY);
      // --------
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
    if (this.stats.health <= 0) { this._expired = true }
    if (this.stats.health < this.stats.maxHealth) { this.stats.health += 0.05 }
    
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
      const script = this.reactions[effect.name];
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
