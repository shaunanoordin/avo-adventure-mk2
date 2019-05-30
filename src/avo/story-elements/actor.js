import { MODES } from '../constants';
import StoryElement from './story-element'

class Actor extends StoryElement {
  constructor () {
    super();
  }
  
  play (app) {}
  
  paint (app) {
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    const camera = { x: 0, y: 0 };  // TEMP
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';
    canvas2d.beginPath();
    canvas2d.arc(this.x + camera.x, this.y + camera.y, (this.sizeX + this.sizeY) / 4, 0, 2 * Math.PI);
    canvas2d.fill();
    canvas2d.closePath();
    
  }
}

export default Actor;
