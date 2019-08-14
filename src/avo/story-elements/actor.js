import { MODES, SHAPES } from '@avo/misc/constants';
import StoryElement from './story-element';
import Particle from './particle';

class Actor extends StoryElement {
  constructor (app, initialValues = {}) {
    super(app);
    
    this.shape = SHAPES.CIRCLE;
    this.solid = true;
    this.movable = true;
    
    this.intent = undefined;
    this.action = undefined;
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  play () {
    const app = this._app;
    this.processUpkeep();
    this.processIntent();
    this.processActions();
  }
  
  paint () {
    // TODO: this should just move the animation frame one step. Add getSprite() for sprite logic, which will be called in ActionMode.
    
    const app = this._app;
    const camera = app.camera;
    const canvas2d = app.actionMode && app.actionMode.canvas2d;
    
    if (app.mode !== MODES.ACTION) return;    
    if (!canvas2d) return;
    
    // Simple shadow
    canvas2d.fillStyle = 'rgba(0, 0, 0, 0.5)';
    canvas2d.beginPath();
    canvas2d.arc(this.x + camera.x, this.y + camera.y, this.size / 2, 0, 2 * Math.PI);
    canvas2d.fill();
    canvas2d.closePath();
    
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
  }
  
  checkStatus(status) {
    return true;  // TODO
  }
  
  processUpkeep () {
    // TODO
  }
  
  processIntent () {
    // Translate intent into action.
    if (this.intent && this.intent.name === 'move' && this.checkStatus('can move')) {
      this.action = Object.assign({}, this.intent);
    } else if (this.checkStatus('can act')) {
      this.action = Object.assign({}, this.intent);
    } else {
      this.action = undefined;
    }
  }
  
  processActions () {
    const app = this._app;
    if (!this.action) return;
    
    // TODO: move all these to a library
    
    if (this.action.name === 'move'
        && !(this.action.x === 0 && this.action.y === 0)
        && this.checkStatus('can move')) {
      const speed = 4; // TODO
      const rotation = Math.atan2(this.action.y, this.action.x);  // TODO
      this.x += Math.cos(rotation) * speed;
      this.y += Math.sin(rotation) * speed;
      this.rotation = rotation;
    }
    
    if (this.action.name === 'primary') {
      console.log('PEW PEW');
      const particle = new Particle(app, { x: this.x, y: this.y + this.sizeY / 2, duration: 5 * 30 });  // TODO
      app.particles.push(particle);
    }
  }  
}

export default Actor;
