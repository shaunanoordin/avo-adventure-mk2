import { DIRECTIONS } from '@avo/misc/constants';

export const STANDARD_ANIMATIONS = {
  ACTOR: function (app, entity, canvas, camera, options = {}) {
    const layer = options.layer || '';

    if (!canvas || !camera) return;

    // Simple shadow
    canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
    // --------
    // Temporary 'animation'
    if (entity.animationName === 'idle') canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
    else if (entity.animationName === 'move-1') canvas.fillStyle = 'rgba(0, 128, 128, 0.5)';
    else if (entity.animationName === 'move-2') canvas.fillStyle = 'rgba(0, 160, 128, 0.5)';
    else if (entity.animationName === 'move-3') canvas.fillStyle = 'rgba(0, 128, 160, 0.5)';
    else if (entity.animationName === 'attack-windup') canvas.fillStyle = 'rgba(192, 192, 0, 0.5)';
    else if (entity.animationName === 'attack-active') canvas.fillStyle = 'rgba(255, 0, 0, 0.5)';
    else if (entity.animationName === 'attack-winddown') canvas.fillStyle = 'rgba(192, 128, 0, 0.5)';
    // --------
    canvas.beginPath();
    canvas.arc(Math.floor(entity.x + camera.x),
               Math.floor(entity.y + camera.y),
               entity.size / 2, 0, 2 * Math.PI);
    canvas.fill();

    // Simple direction
    // --------
    canvas.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.moveTo(Math.floor(entity.x + camera.x),
                  Math.floor(entity.y + camera.y));
    canvas.lineTo(Math.floor(entity.x + camera.x) + Math.cos(entity.rotation) * entity.size * 0.6,
                  Math.floor(entity.y + camera.y) + Math.sin(entity.rotation) * entity.size * 0.6);
    canvas.stroke();
    // --------

    // Paint actor sprite
    // --------
    if (entity.animationSpritesheet) {
      const SPRITE_SIZE = 48;
      let SPRITE_OFFSET_X = 0;
      let SPRITE_OFFSET_Y = -8;

      const srcSizeX = SPRITE_SIZE;
      const srcSizeY = SPRITE_SIZE;
      let srcX = 0;
      let srcY = 0;

      switch (entity.direction) {
        case DIRECTIONS.SOUTH: srcX = SPRITE_SIZE * 0; break;
        case DIRECTIONS.NORTH: srcX = SPRITE_SIZE * 1; break;
        case DIRECTIONS.EAST: srcX = SPRITE_SIZE * 2; break;
        case DIRECTIONS.WEST: srcX = SPRITE_SIZE * 3; break;
      }

      switch (entity.animationName) {
        case 'move-1': srcY = SPRITE_SIZE * 1; break;
        case 'move-2': srcY = SPRITE_SIZE * 2; break;
        case 'move-3': srcY = SPRITE_SIZE * 3; break;
        case 'attack-windup': srcY = SPRITE_SIZE * 4; break;
        case 'attack-active': srcY = SPRITE_SIZE * 5; break;
        case 'attack-winddown': srcY = SPRITE_SIZE * 5; break;
        case 'dash': srcY = SPRITE_SIZE * 1; break;
      }

      const tgtSizeX = SPRITE_SIZE;
      const tgtSizeY = SPRITE_SIZE;
      const tgtX = Math.floor(entity.x + camera.x) - srcSizeX / 2 + SPRITE_OFFSET_X;
      const tgtY = Math.floor(entity.y + camera.y) - srcSizeY / 2 + SPRITE_OFFSET_Y;

      canvas.drawImage(entity.animationSpritesheet.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY);
    }
    // --------

    // Paint UI entitys
    // --------
    let healthOffsetY = 7;
    const healthRatio = (entity.attr.maxHealth > 0)
      ? (entity.attr.health || 0) / entity.attr.maxHealth
      : 0;
    canvas.strokeStyle = 'rgba(0, 0, 0)';
    canvas.lineWidth = 4;
    canvas.beginPath();
    canvas.moveTo(Math.floor(entity.x + camera.x) - entity.size / 3,
                  Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    canvas.lineTo(Math.floor(entity.x + camera.x) + entity.size / 3,
                  Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    canvas.stroke();
    canvas.strokeStyle = 'rgba(255, 0, 0)';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.moveTo(Math.floor(entity.x + camera.x) - (entity.size / 3 * healthRatio),
                  Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    canvas.lineTo(Math.floor(entity.x + camera.x) + (entity.size / 3 * healthRatio),
                  Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    canvas.stroke();

    healthOffsetY = 4;
    canvas.font = '8px Arial';
    canvas.fillStyle = 'rgba(204, 68, 68)';    
    canvas.textBaseline = 'hanging';
    canvas.textAlign = 'right';
    canvas.fillText('❤️',
                    Math.floor(entity.x + camera.x) - entity.size / 3,
                    Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    canvas.textAlign = 'left';
    canvas.fillText(Math.floor(entity.attr.health),
                    Math.floor(entity.x + camera.x) + entity.size / 3,
                    Math.floor(entity.y + camera.y) + entity.size / 2 + healthOffsetY);
    // --------
  },
  
  PARTICLE: function (app, entity, canvas, camera, options = {}) {
    const layer = options.layer || '';

    if (!canvas || !camera) return;

    // Simple shadow
    canvas.fillStyle = 'rgba(238, 238, 204, 0.5)';
    canvas.beginPath();
    canvas.arc(entity.x + camera.x, entity.y + camera.y, entity.size / 2, 0, 2 * Math.PI);
    canvas.fill();
  },
};
