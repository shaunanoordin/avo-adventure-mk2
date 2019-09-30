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
    
    const size = this.tileSize;
    
    const leftCol = Math.floor(element.left / size);
    const rightCol = Math.floor(element.right / size);
    const topRow = Math.floor(element.top / size)
    const bottomRow = Math.floor(element.bottom / size)
    
    const tileLT = this.getTile(leftCol, topRow);
    const tileRT = this.getTile(rightCol, topRow);
    const tileLB = this.getTile(leftCol, bottomRow);
    const tileRB = this.getTile(rightCol, bottomRow);
    
    let correctionDirectionX = 0;
    let correctionDirectionY = 0;
    
    // Determine which tiles are blocking the element, and in which direction
    // the correction needs to be done.
    if (tileLT.wall) { correctionDirectionX++; correctionDirectionY++; }
    if (tileRT.wall) { correctionDirectionX--; correctionDirectionY++; }
    if (tileLB.wall) { correctionDirectionX++; correctionDirectionY--; }
    if (tileRB.wall) { correctionDirectionX--; correctionDirectionY--; }
    
    let correctionX = 0;
    let correctionY = 0;
    
    // Determine how far the correction needs to be made.
    // (i.e. determine how 'deep' the element pushed into the blocking tile.)
    if (correctionDirectionX > 0) {
      const tileEdgeX = leftCol * size + size;
      correctionX = tileEdgeX - element.left;
    } else if (correctionDirectionX < 0) {
      const tileEdgeX = rightCol * size;
      correctionX = tileEdgeX - element.right;
    }
    
    if (correctionDirectionY > 0) {
      const tileEdgeY = topRow * size + size;
      correctionY = tileEdgeY - element.top;
    } else if (correctionDirectionY < 0) {
      const tileEdgeY = bottomRow * size;
      correctionY = tileEdgeY - element.bottom;
    }
    
    // Only correct on one axis at a time.
    const correctionXmagnitude = Math.abs(correctionX);
    const correctionYmagnitude = Math.abs(correctionY);
    
    // DEBUG
    if (element === this._app.playerActor)
      console.log('x: ', correctionX, ' || y: ', correctionY);
    
    if (correctionXmagnitude > 0 && correctionYmagnitude > 0) {
      if (correctionXmagnitude > correctionYmagnitude) correctionX = 0;
      else if (correctionXmagnitude < correctionYmagnitude) correctionY = 0;
    }
    
    let collisionCorrectedX = element.x + correctionX;
    let collisionCorrectedY = element.y + correctionY;
    
    // DEBUG
    // if (element === this._app.playerActor) console.log(tileLT.wall);
    
    return {
      x: collisionCorrectedX,
      y: collisionCorrectedY,
    }
  }
  
  getTile (col, row) {
    const index = row * this.width + col;
    const size = this.tileSize;
    const tileValue = this.tiles[index] || '';
    const tileType = this.tileTypes[tileValue] || DEFAULT_TILE_TYPE;
    
    return {
      col,
      row,
      // left: col * size,
      // right: col * size + size,
      // top: col * size,
      // bottom: col * size + size,
      ...tileType,
    };
  }
}

export default Map;