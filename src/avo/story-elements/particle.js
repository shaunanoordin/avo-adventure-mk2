import { MODES, SHAPES } from '@avo/misc/constants';
import StoryElement from './story-element'

class Particle extends StoryElement {
  constructor (app, initialValues) {
    super(app);
    this.shape = SHAPES.CIRCLE;
    
    this.duration = Infinity;
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play () {
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
    // TODO
    if (target && target.stats) {
      target.stats.health = Math.max((target.stats.health || 0) - 2, 0); 
    }
  }
}

export default Particle;
