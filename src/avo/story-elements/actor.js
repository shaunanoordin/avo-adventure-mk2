import { MODES } from '../constants';
import StoryElement from './story-element'

class Actor extends StoryElement {
  constructor (app) {
    super(app);
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
    
    // Paint basic actor
    const assets = app.assets;
    const srcX = 0, srcY = 0;
    const srcSizeX = this.sizeX, srcSizeY = this.sizeY;
    const tgtX = this.x - srcSizeX / 2, tgtY = this.y - srcSizeY / 2;
    const tgtSizeX = this.sizeX, tgtSizeY = this.sizeY;
    canvas2d.drawImage(assets.basicActor.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
  }
}

export default Actor;
