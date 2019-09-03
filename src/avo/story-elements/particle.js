import { FRAMES_PER_SECOND, MODES, SHAPES } from '@avo/misc/constants';
import StoryElement from './story-element'

const COLLISION_SPACING = FRAMES_PER_SECOND / 2;

class Particle extends StoryElement {
  constructor (app, initialValues) {
    super(app);
    this.shape = SHAPES.CIRCLE;
    
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
    // Perform upkeep on the list of recent targets:
    // Tick down the recent target's duration, then remove any that has 0 duration.
    this.recentTargets = this.recentTargets.filter(item => ( --item.duration > 0 ))
    
    // Tick down the duration and remove if the timer runs out.
    // Note that if duration === Infinity, the Particle is permanent.
    this.duration --;
    if (this.duration < 0) this._expired = true;
  }
  
  paint () {
    const app = this._app;
    const camera = app.camera;
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(238, 238, 204, 0.5)';
    canvas2d.beginPath();
    canvas2d.arc(this.x + camera.x, this.y + camera.y, this.size / 2, 0, 2 * Math.PI);
    canvas2d.fill();
  }
  
  onCollision (target, collisionCorrection) {

    const targetIsValid = !!target  // Is there a target?
      && !(this.ignoreSource && this.source === target)  // If the target is the source of the Particle, ignore it?
      && !this.recentTargets.find(t => ( t.target === target ));
    
    if (targetIsValid) {
      // TODO
      if (target && target.stats) {
        target.stats.health = Math.max((target.stats.health || 0) - 10, 0); 
      }
      
      // Add to the list of recent targets, so targets aren't hit back to back to back.
      this.recentTargets.push({ target, duration: COLLISION_SPACING })
    }
    
  }
}

export default Particle;
