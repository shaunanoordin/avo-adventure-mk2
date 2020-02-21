import { ACTION_TYPES, EFFECTS_STACKING } from '@avo/misc/constants';
import { STANDARD_ANIMATIONS } from '@avo/animations';
import Particle from '@avo/story-elements/particle';

export const STANDARD_ACTIONS = {
  IDLE: {
    type: ACTION_TYPES.IDLE,
    steps: 1,
    script: function ({ app, element, action, actionAttr, step }) {
      element.animationName = 'idle';
    }
  },
  
  MOVE: {
    type: ACTION_TYPES.CONTINUOUS,
    steps: 6 * 2,
    script: function ({ app, element, action, actionAttr, step }) {
      const acceleration = element.stats.acceleration || 0;

      const actionRotation = Math.atan2(actionAttr.y, actionAttr.x);
      let moveX = element.moveX + acceleration * Math.cos(actionRotation);
      let moveY = element.moveY + acceleration * Math.sin(actionRotation);

      if (element.stats.maxSpeed >= 0) {
        const maxSpeed = element.stats.maxSpeed;
        const correctedSpeed = Math.min(maxSpeed, Math.sqrt(moveX * moveX + moveY * moveY));
        const moveRotation = Math.atan2(moveY, moveX);
        moveX = correctedSpeed * Math.cos(moveRotation);
        moveY = correctedSpeed * Math.sin(moveRotation);
      }

      element.moveX = moveX;
      element.moveY = moveY;
      element.rotation = actionRotation;

      if (0 * 2 <= step && step < 1 * 2) element.animationName = 'move-1';
      else if (1 * 2 <= step && step < 3 * 2) element.animationName = 'move-2';
      else if (3 * 2 <= step && step < 4 * 2) element.animationName = 'move-1';
      else if (4 * 2 <= step && step < 6 * 2) element.animationName = 'move-3';
    },
  },
  
  ATTACK: {
    type: ACTION_TYPES.STANDARD,
    steps: 15,
    script: function ({ app, element, action, actionAttr, step }) {
      if (step < 10) {

        element.animationName = 'attack-windup';

      } else if (step === 10) {

        const particle = new Particle(app, {
          x: element.x + Math.cos(element.rotation) * element.size * 0.8,
          y: element.y + Math.sin(element.rotation) * element.size * 0.8,
          size: element.size * 1,
          duration: 1000,
          source: element,
          ignoreSource: true,
          stats: {
            attackPower: 20,
            pushPower: 8,
            pushAngle: element.rotation,
            pushDuration: 1000,
            pushDecay: 1,
          },
          scripts: {
            'collision': function ({ app, element, target }) {
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

        element.animationName = 'attack-active';

      } else {

        element.animationName = 'attack-winddown';

      }
    }
  },
  
  DASH: {
    type: ACTION_TYPES.STANDARD,
    steps: 6,
    script: function ({ app, element, action, actionAttr, step }) {
      element.animationName = 'dash';
      
      const power = (element.stats.maxSpeed)
        ? element.stats.maxSpeed * 3  * (6 - step) / 6
        : 0;
      element.pushX += power * Math.cos(element.rotation);
      element.pushY += power * Math.sin(element.rotation);

    }
  },
};
