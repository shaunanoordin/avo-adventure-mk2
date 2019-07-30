import { MODES } from '@avo/misc/constants';
import StoryElement from './story-element'

class Particle extends StoryElement {
  constructor (app) {
    super(app);
    
    this.duration = Infinity;
  }
  
  play (app) {
    this.duration --;
    
    if (this.duration < 0) this._expired = true;
  }
  
  paint (app) {
    const camera = app.camera;
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(255, 255, 0, 0.5)';
    canvas2d.beginPath();
    canvas2d.arc(this.x + camera.x, this.y + camera.y, (this.sizeX + this.sizeY) / 4, 0, 2 * Math.PI);
    canvas2d.fill();
    canvas2d.closePath();
  }  
}

export default Actor;
