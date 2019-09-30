class Map {
  constructor (app, initialValues) {
    this._app = app;
    
    this.width = 16;
    this.height = 16;
    
    this.tiles = [];
    this.tileSize = 32;
    this.tileTypes = {
      ' ': {
        floor: true,
        wall: false,
        colour: '#eec',
      },
      '#': {
        floor: true,
        wall: true,
        colour: '#844',
      }
    };
    
    // Set initial values
    Object.assign(this, initialValues);
  }
  
  paint (canvas, camera, options = {}) {
    const app = this._app;
    const size = this.tileSize;
    
    if (!canvas || !camera) return;
    
    
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.height; col++) {
        canvas.strokeStyle = '#888';
        canvas.strokeRect(
          Math.floor(col * size + camera.x),
          Math.floor(row * size + camera.y),
          size,
          size
        );
      }
    }
    
  }
  
  parseTiles (str) {
    
  }
  
  getTile (col, row) {
    const index = row * this.width + col;
    
    return {};
  }
}

export default Map;