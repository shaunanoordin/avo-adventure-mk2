class Map {
  constructor (app, initialValues) {
    this._app = app;
    
    this.width = 16;
    this.height = 16;
    
    this.tiles = [];
    this.tileSize = 64;
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
  
  paint () {
    
  }
  
  parseTiles (str) {
    
  }
  
  getTile (col, row) {
    const index = row * this.width + col;
    
    return {};
  }
}

export default Map;