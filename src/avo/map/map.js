const DEFAULT_TILE_TYPE = {
  floor: false,
  wall: false,
  colour: '#fff',
};

class Map {
  constructor (app, initialValues) {
    this._app = app;
    
    this.width = 16;
    this.height = 16;
    
    this.tiles =
      '  ############  ' +
      ' ##          ## ' +
      '##            ##' +
      '#              #' +
      '#   ###  ###   #' +
      '#   #      #   #' +
      '#   #      #   #' +
      '#      ##      #' +
      '#      ##      #' +
      '#   #      #   #' +
      '#   #      #   #' +
      '#   ###  ###   #' +
      '#              #' +
      '##    ####     #' +
      ' ##          ## ' +
      '  ############  ';
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
        const tile = this.getTile(col, row);
        
        canvas.fillStyle = (tile && tile.colour) || '#fff';
        canvas.fillRect(
          Math.floor(col * size + camera.x),
          Math.floor(row * size + camera.y),
          size,
          size
        );
      }
    }
    
  }
  
  checkCollision (element) {
    if (!element) return;
    
    const tile = this.getTile(Math.floor(element.x / this.tileSize), Math.floor(element.y / this.tileSize));

    // DEBUG
    // if (element === this._app.playerActor) console.log(tile.col, tile.row);
    
    return {
      x: element.x,
      y: element.y,
    }
  }
  
  getTile (col, row) {
    const index = row * this.width + col;
    const tileValue = this.tiles[index] || '';
    const tileType = this.tileTypes[tileValue] || DEFAULT_TILE_TYPE;
    
    return {
      col,
      row,
      ...tileType,
    };
  }
}

export default Map;