import { ACTION_TYPES, EFFECTS_STACKING } from '@avo/misc/constants';
import { STANDARD_ANIMATIONS } from '@avo/animations';
import Particle from '@avo/entities/particle';

export const STANDARD_ACTIONS = {
  IDLE: {
    type: ACTION_TYPES.IDLE,
    duration: 1,
    script: function ({ app, entity, action, actionAttr, progress, timeStep }) {
      entity.animationName = 'idle';
    }
  },
  
  MOVE: {
    type: ACTION_TYPES.CONTINUOUS,
    duration: 500,
    script: function ({ app, entity, action, actionAttr, progress, timeStep }) {
      const acceleration = entity.stats.acceleration * timeStep / 1000 || 0;

      const actionRotation = Math.atan2(actionAttr.y, actionAttr.x);
      let moveX = entity.moveX + acceleration * Math.cos(actionRotation);
      let moveY = entity.moveY + acceleration * Math.sin(actionRotation);

      if (entity.stats.maxSpeed >= 0) {
        const maxSpeed = entity.stats.maxSpeed;
        const correctedSpeed = Math.min(maxSpeed, Math.sqrt(moveX * moveX + moveY * moveY));
        const moveRotation = Math.atan2(moveY, moveX);
        moveX = correctedSpeed * Math.cos(moveRotation);
        moveY = correctedSpeed * Math.sin(moveRotation);
      }

      entity.moveX = moveX;
      entity.moveY = moveY;
      entity.rotation = actionRotation;

      if (0 <= progress && progress < 0.25) entity.animationName = 'move-1';
      else if (0.25 <= progress && progress < 0.50) entity.animationName = 'move-2';
      else if (0.50 <= progress && progress < 0.75) entity.animationName = 'move-1';
      else if (0.75 <= progress && progress <= 1) entity.animationName = 'move-3';
    },
  },
  
  ATTACK: {
    type: ACTION_TYPES.STANDARD,
    duration: 1000,
    script: function ({ app, entity, action, actionAttr, progress, timeStep }) {
      if (progress < 0.6) {

        actionAttr.triggered = false;
        entity.animationName = 'attack-windup';

      } else if (progress >= 0.6 && !actionAttr.triggered) {
        
        actionAttr.triggered = true;

        const particle = new Particle(app, {
          x: entity.x + Math.cos(entity.rotation) * entity.size * 0.8,
          y: entity.y + Math.sin(entity.rotation) * entity.size * 0.8,
          size: entity.size * 1,
          duration: 1000,
          source: entity,
          ignoreSource: true,
          stats: {
            attackPower: 20,
            pushPower: 100,
            pushAngle: entity.rotation,
            pushDuration: 1000,
            pushDecay: 100,
          },
          scripts: {
            'collision': function ({ app, entity, target }) {
              if (target && target.stats) {
                target.stats.health = Math.max((target.stats.health || 0) - particle.stats.attackPower, 0);

                particle.applyEffect({
                  name: 'push',
                  attr: {
                    power: particle.stats.pushPower,
                    angle: particle.stats.pushAngle,
                    decay: particle.stats.pushDecay,
                  },
                  duration: particle.stats.pushDuration,
                  stacking: EFFECTS_STACKING.STACK,
                }, target);

              }
            },
          },
          animationScript: STANDARD_ANIMATIONS.PARTICLE,
        });
        
        app.particles.push(particle);

        entity.animationName = 'attack-active';

      } else {

        entity.animationName = 'attack-winddown';

      }
    }
  },
  
  DASH: {
    type: ACTION_TYPES.STANDARD,
    duration: 200,
    script: function ({ app, entity, action, actionAttr, progress, timeStep }) {
      entity.animationName = 'dash';
      
      // TODO: factor in timestep?
      
      const power = (entity.stats.maxSpeed)
        ? entity.stats.maxSpeed * 3  * (1 - progress)
        : 0;
      entity.pushX += power * Math.cos(entity.rotation);
      entity.pushY += power * Math.sin(entity.rotation);

    }
  },
};
