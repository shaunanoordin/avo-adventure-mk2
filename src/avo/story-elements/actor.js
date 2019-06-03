import { MODES } from '../constants';
import StoryElement from './story-element'

class Actor extends StoryElement {
  constructor (app) {
    super(app);
    
    this.intent = undefined;
    this.action = undefined;
  }
  
  play (app) {
    // Translate intent into action.
    if (this.intent && this.intent.name === 'move' && this.checkState('can move')) {
      this.action = Object.assign({}, this.intent);
    } else {
      this.action = undefined;
    }
    
    // Perform actions
    if (this.action && this.action.name === 'move'
        && !(this.action.x === 0 && this.action.y === 0)
        && this.checkState('can move')) {
      const speed = 4; // TODO
      const rotation = Math.atan2(this.action.y, this.action.x);  // TODO
      this.x += Math.cos(rotation) * speed;
      this.y += Math.sin(rotation) * speed;
    }
  }
  
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
    const tgtX = Math.floor(this.x - srcSizeX / 2), tgtY = Math.floor(this.y - srcSizeY / 2);
    const tgtSizeX = Math.floor(this.sizeX), tgtSizeY = Math.floor(this.sizeY);
    canvas2d.drawImage(assets.basicActor.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
  }
  
  checkState(state) {
    return true;  // TODO
  }
}

export default Actor;
