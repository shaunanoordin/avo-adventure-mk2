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
      '#    ##  ##    #' +
      '#   ##    ##   #' +
      '#   #      #   #' +
      '#      ##      #' +
      '#      ##      #' +
      '#   #      #   #' +
      '# # ##    ## # #' +
      '##   ##  ##   ##' +
      '#              #' +
      '##   # ## #   ##' +
      ' ##          ## ' +
      '  ############  ';
    this.tileSize = 32;
    this.tileTypes = {
      ' ': {
        floor: true,
        wall: false,
        colour: '#efd',
      },
      '#': {
        floor: true,
        wall: true,
        colour: '#486',
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
          col * size + Math.floor(camera.x),
          row * size + Math.floor(camera.y),
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
    let correctionX = 0;
    let correctionY = 0;
    
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
    
    return {
      x: correctionX,
      y: correctionY,
    }
    
    // Note: previously, before we had checkCollision_diagonals(), we had a
    // 'gradual correction' code that pushed the element out of the wall bit
    // by bit to avoid a sudden repositioning of the element.
    // Weakness: if the element's movement speed exceeds the GRADUAL_CORRECTION
    // value, the element can just jog through the wall. If the
    // GRADUAL_CORRECTION was too high, we'd just repeat the sudden
    // repositioning problem.
    //
    // const GRADUAL_CORRECTION = 8;
    // if (correctionDirectionX > 0) {
    //    const tileEdgeX = leftCol * size + size;
    //    const penetratingX = element.left - tileEdgeX;
    //    correctionX = Math.min(-penetratingX, GRADUAL_CORRECTION);
    // }
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
        const angle = Math.atan2(distY, distX);
        correctionX = (element.radius - dist) * Math.cos(angle);
        correctionY = (element.radius - dist) * Math.sin(angle);
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