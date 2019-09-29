import { DIRECTIONS } from '@avo/misc/constants';

export const STANDARD_ANIMATIONS = {
  ACTOR: function (app, element, canvas, options = {}) {
      
    const camera = app.camera;
    const layer = options.layer || '';

    if (!canvas) return;

    // Simple shadow
    canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // --------
    // Temporary 'animation'
    if (element.animationName === 'idle') canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
    else if (element.animationName === 'move-1') canvas.fillStyle = 'rgba(0, 128, 128, 0.5)';
    else if (element.animationName === 'move-2') canvas.fillStyle = 'rgba(0, 160, 128, 0.5)';
    else if (element.animationName === 'move-3') canvas.fillStyle = 'rgba(0, 128, 160, 0.5)';
    else if (element.animationName === 'attack-windup') canvas.fillStyle = 'rgba(192, 192, 0, 0.5)';
    else if (element.animationName === 'attack-active') canvas.fillStyle = 'rgba(255, 0, 0, 0.5)';
    else if (element.animationName === 'attack-winddown') canvas.fillStyle = 'rgba(192, 128, 0, 0.5)';
    // --------
    canvas.beginPath();
    canvas.arc(element.x + camera.x, element.y + camera.y, element.size / 2, 0, 2 * Math.PI);
    canvas.fill();

    // Simple direction
    // --------
    canvas.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.moveTo(element.x, element.y);
    canvas.lineTo(element.x + Math.cos(element.rotation) * element.size * 0.6,
                    element.y + Math.sin(element.rotation) * element.size * 0.6);
    canvas.stroke();
    // --------

    // Paint actor sprite
    // --------
    if (element.animationSpritesheet) {
      const SPRITE_SIZE = 48;
      let SPRITE_OFFSET_X = 0;
      let SPRITE_OFFSET_Y = -8;

      const srcSizeX = SPRITE_SIZE;
      const srcSizeY = SPRITE_SIZE;
      let srcX = 0;
      let srcY = 0;

      switch (element.direction) {
        case DIRECTIONS.SOUTH: srcX = SPRITE_SIZE * 0; break;
        case DIRECTIONS.NORTH: srcX = SPRITE_SIZE * 1; break;
        case DIRECTIONS.EAST: srcX = SPRITE_SIZE * 2; break;
        case DIRECTIONS.WEST: srcX = SPRITE_SIZE * 3; break;
      }

      switch (element.animationName) {
        case 'move-1': srcY = SPRITE_SIZE * 1; break;
        case 'move-2': srcY = SPRITE_SIZE * 2; break;
        case 'move-3': srcY = SPRITE_SIZE * 3; break;
        case 'attack-windup': srcY = SPRITE_SIZE * 4; break;
        case 'attack-active': srcY = SPRITE_SIZE * 5; break;
        case 'attack-winddown': srcY = SPRITE_SIZE * 5; break;
      }

      const tgtSizeX = SPRITE_SIZE;
      const tgtSizeY = SPRITE_SIZE;
      const tgtX = Math.floor(element.x - srcSizeX / 2 + SPRITE_OFFSET_X);
      const tgtY = Math.floor(element.y - srcSizeY / 2 + SPRITE_OFFSET_Y);

      canvas.drawImage(element.animationSpritesheet.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
    }
    // --------

    // Paint UI elements
    // --------
    let healthOffsetY = 7;
    const healthRatio = (element.stats.maxHealth > 0)
      ? (element.stats.health || 0) / element.stats.maxHealth
      : 0;
    canvas.strokeStyle = 'rgba(0, 0, 0)';
    canvas.lineWidth = 4;
    canvas.beginPath();
    canvas.moveTo(element.x - element.size / 3,
                  element.y + element.size / 2 + healthOffsetY);
    canvas.lineTo(element.x + element.size / 3,
                  element.y + element.size / 2 + healthOffsetY);
    canvas.stroke();
    canvas.strokeStyle = 'rgba(255, 0, 0)';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.moveTo(element.x - (element.size / 3 * healthRatio),
                  element.y + element.size / 2 + healthOffsetY);
    canvas.lineTo(element.x + (element.size / 3 * healthRatio),
                  element.y + element.size / 2 + healthOffsetY);
    canvas.stroke();

    healthOffsetY = 4;
    canvas.font = '8px Arial';
    canvas.fillStyle = 'rgba(204, 68, 68)';    
    canvas.textBaseline = 'hanging';
    canvas.textAlign = 'right';
    canvas.fillText('❤️', element.x - element.size / 3, element.y + element.size / 2 + healthOffsetY);
    canvas.textAlign = 'left';
    canvas.fillText(Math.floor(element.stats.health), element.x + element.size / 3, element.y + element.size / 2 + healthOffsetY);
    // --------
  },
};
