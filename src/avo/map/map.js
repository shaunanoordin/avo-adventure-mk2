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
    if (!element || !element.solid) return;
    
    const tileLT = this.getTile(Math.floor(element.left / this.tileSize),
                                Math.floor(element.top / this.tileSize));
    const tileRT = this.getTile(Math.floor(element.right / this.tileSize),
                                Math.floor(element.top / this.tileSize));
    const tileLB = this.getTile(Math.floor(element.left / this.tileSize),
                                Math.floor(element.bottom / this.tileSize));
    const tileRB = this.getTile(Math.floor(element.right / this.tileSize),
                                Math.floor(element.bottom / this.tileSize));
    
    let correctionX = 0;
    let correctionY = 0;
    
    if (tileLT.wall) { correctionX++; correctionY++; }
    if (tileRT.wall) { correctionX--; correctionY++; }
    if (tileLB.wall) { correctionX++; correctionY--; }
    if (tileRB.wall) { correctionX--; correctionY--; }
    

    // DEBUG
    // if (element === this._app.playerActor) console.log(tileLT.wall);
    
    return {
      x: element.x + correctionX,
      y: element.y + correctionY,
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