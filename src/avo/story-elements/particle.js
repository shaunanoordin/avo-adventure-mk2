import { EFFECTS_STACKING, FRAMES_PER_SECOND, MODES, SHAPES } from '@avo/misc/constants';
import StoryElement from './story-element'

const COLLISION_SPACING = FRAMES_PER_SECOND / 2;

class Particle extends StoryElement {
  constructor (app, initialValues) {
    super(app);
    this.shape = SHAPES.CIRCLE;
    
    this.scripts = {
      'always': function (app, particle) {},
      'collision': function (app, particle, target) {}
    };
    
    // Particles can have a limited duration.
    this.duration = Infinity;
    
    // When applying effects on collision, Particles can ignore their source
    // (the Actor that created it), if any.
    // (e.g. sword swings shouldn't hit their wielder. Nobody's that clumsy.)
    this.source = undefined;
    this.ignoreSource = false;
    
    // When applying effects on collision, Particles shouldn't hit the same
    // targets perpetually every single frame.
    this.recentTargets = [];
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play () {
    const app = this._app;
    
    // Run script: "always execute on every frame"
    this.scripts.always && this.scripts.always(app, this);
    
    // Perform upkeep on the list of recent targets:
    // Tick down the recent target's duration, then remove any that has 0 duration.
    this.recentTargets = this.recentTargets.filter(item => ( --item.duration > 0 ))
    
    // Tick down the duration and remove if the timer runs out.
    // Note that if duration === Infinity, the Particle is permanent.
    this.duration --;
    if (this.duration < 0) this._expired = true;
  }
    
  onCollision (target, collisionCorrection) {
    const app = this._app;

    const targetIsValid = !!target  // Is there a target?
      && !(this.ignoreSource && this.source === target)  // If the target is the source of the Particle, ignore it?
      && !this.recentTargets.find(t => ( t.target === target ));
    
    if (targetIsValid) {
      // Run script: particle collided with a target
      this.scripts.collision && this.scripts.collision(app, this, target);
      
      // Add to the list of recent targets, so targets aren't hit back to back to back.
      this.recentTargets.push({ target, duration: COLLISION_SPACING })
    }
  }
  
  applyEffect (effect, target) {
    if (!effect || !target) return;
    
    let shouldApply = !!target.reactions[effect.name];  // Does the target have a script to react to this effect?
    
    // TODO: check on effects stacking.
    // const existingEffect = target.effects.find(eff => eff.name === effect.name);
    
    if (shouldApply) {
      // Prepare to add new effect
      const reaction = target.reactions[effect.name] || {};
      reaction.onAdd && reaction.onAdd(app, target, effect);
      
      target.effects.push(effect);
    }    
  }
}

export default Particle;
