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
      '# ############  ' +
      '  #          ## ' +
      '##            ##' +
      '#              #' +
      '#    ##  ###   #' +
      '#   ##     #   #' +
      '#   #      #   #' +
      '#      ##      #' +
      '#   #  ##      #' +
      '#   #      #   #' +
      '#   #      #   #' +
      '#   ###  ###   #' +
      '#              #' +
      '##    ####    ##' +
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
    
    // First check if there are any collisions in the cardinal directions.
    let collisionCorrection = this.checkCollision_cardinals(element);
    
    // If not, check for collisions in the diagonal directions.
    if (collisionCorrection.x === 0 && collisionCorrection.y === 0) {
       collisionCorrection = this.checkCollision_diagonals(element);
    }
    
    return {
      x: element.x + collisionCorrection.x,
      y: element.y + collisionCorrection.y,
    };
  }
  
  checkCollision_cardinals (element) {
    const size = this.tileSize;
    
    const leftCol = Math.floor(element.left / size);
    const midCol = Math.floor(element.x / size);
    const rightCol = Math.floor(element.right / size);
    const topRow = Math.floor(element.top / size);
    const midRow = Math.floor(element.y / size);
    const bottomRow = Math.floor(element.bottom / size);
    
    const tileL = this.getTile(leftCol, midRow);
    const tileR = this.getTile(rightCol, midRow);
    const tileT = this.getTile(midCol, topRow);
    const tileB = this.getTile(midCol, bottomRow);
    
    // Determine which tiles are blocking the element, and in which direction
    // the correction needs to be done.
    let correctionDirectionX = 0;
    let correctionDirectionY = 0;
    if (tileL.wall) { correctionDirectionX++; }
    if (tileR.wall) { correctionDirectionX--; }
    if (tileT.wall) { correctionDirectionY++; }
    if (tileB.wall) { correctionDirectionY--; }
    
    // Determine how far the correction needs to be made.
    // (i.e. determine how 'deep' the element pushed into the blocking tile.)
    const GRADUAL_CORRECTION = 8;
    let correctionX = 0;
    let correctionY = 0;
    let penetratingX = 0;
    let penetratingY = 0;
    
    if (correctionDirectionX > 0) {
      const tileEdgeX = leftCol * size + size;
      penetratingX = element.left - tileEdgeX;
      correctionX = Math.min(-penetratingX, GRADUAL_CORRECTION);
    } else if (correctionDirectionX < 0) {
      const tileEdgeX = rightCol * size;
      penetratingX = element.right - tileEdgeX;
      correctionX = Math.max(-penetratingX, -GRADUAL_CORRECTION);
    }
    
    if (correctionDirectionY > 0) {
      const tileEdgeY = topRow * size + size;
      penetratingY = element.top - tileEdgeY;
      correctionY = Math.min(-penetratingY, GRADUAL_CORRECTION);
    } else if (correctionDirectionY < 0) {
      const tileEdgeY = bottomRow * size;
      penetratingY = element.bottom - tileEdgeY;
      correctionY = Math.max(-penetratingY, -GRADUAL_CORRECTION);
    }
    
    return {
      x: correctionX,
      y: correctionY,
    }
  }
  
  checkCollision_diagonals (element) {
    const size = this.tileSize;
    
    const leftCol = Math.floor(element.left / size);
    const rightCol = Math.floor(element.right / size);
    const topRow = Math.floor(element.top / size);
    const bottomRow = Math.floor(element.bottom / size);
    
    const tileLT = this.getTile(leftCol, topRow);
    const tileRT = this.getTile(rightCol, topRow);
    const tileLB = this.getTile(leftCol, bottomRow);
    const tileRB = this.getTile(rightCol, bottomRow);
    
    // Determine which tiles are blocking the element, and in which direction
    // the correction needs to be done.
    let correctionDirectionX = 0;
    let correctionDirectionY = 0;
    if (tileLT.wall) { correctionDirectionX++; correctionDirectionY++; }
    if (tileRT.wall) { correctionDirectionX--; correctionDirectionY++; }
    if (tileLB.wall) { correctionDirectionX++; correctionDirectionY--; }
    if (tileRB.wall) { correctionDirectionX--; correctionDirectionY--; }
    
    let correctionX = 0;
    let correctionY = 0;
    if (correctionDirectionX !== 0 && correctionDirectionY !== 0) {
      
      let cornerX = 0;
      let cornerY = 0;
      
      if (correctionDirectionX > 0) cornerX = leftCol * size + size;
      if (correctionDirectionX < 0) cornerX = rightCol * size;
      if (correctionDirectionY > 0) cornerY = topRow * size + size;
      if (correctionDirectionY < 0) cornerY = bottomRow * size;
      
      // Assumes element is a circle.
      
      const distX = element.x - cornerX;
      const distY = element.y - cornerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      
      // If element's radius is too close to the corner, push the element away. 
      if (dist < element.radius) {
        const GRADUAL_CORRECTION = 10;
        const angle = Math.atan2(distY, distX);
        correctionX = element.radius / GRADUAL_CORRECTION * Math.cos(angle);
        correctionY = element.radius / GRADUAL_CORRECTION * Math.sin(angle);
      }
    }
    
    return {
      x: correctionX,
      y: correctionY,
    }
  }
  
  getTile (col, row) {
    const index = (col >= 0 && col < this.width && row >= 0 && row < this.height)
      ? row * this.width + col
      : undefined;
    const size = this.tileSize;
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