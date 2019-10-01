import { ACTION_TYPES, EFFECTS_STACKING } from '@avo/misc/constants';
import { STANDARD_ANIMATIONS } from '@avo/animations';
import Particle from '@avo/story-elements/particle';

export const STANDARD_ACTIONS = {
  IDLE: {
    type: ACTION_TYPES.IDLE,
    steps: 1,
    script: function (app, actor, action, actionAttr, step) {
      actor.animationName = 'idle';
    }
  },
  
  MOVE: {
    type: ACTION_TYPES.CONTINUOUS,
    steps: 6 * 2,
    script: function (app, actor, action, actionAttr, step) {
      const acceleration = actor.stats.acceleration || 0;

      const actionRotation = Math.atan2(actionAttr.y, actionAttr.x);
      let moveX = actor.moveX + acceleration * Math.cos(actionRotation);
      let moveY = actor.moveY + acceleration * Math.sin(actionRotation);

      if (actor.stats.maxSpeed >= 0) {
        const maxSpeed = actor.stats.maxSpeed;
        const correctedSpeed = Math.min(maxSpeed, Math.sqrt(moveX * moveX + moveY * moveY));
        const moveRotation = Math.atan2(moveY, moveX);
        moveX = correctedSpeed * Math.cos(moveRotation);
        moveY = correctedSpeed * Math.sin(moveRotation);
      }

      actor.moveX = moveX;
      actor.moveY = moveY;
      actor.rotation = actionRotation;

      if (0 * 2 <= step && step < 1 * 2) actor.animationName = 'move-1';
      else if (1 * 2 <= step && step < 3 * 2) actor.animationName = 'move-2';
      else if (3 * 2 <= step && step < 4 * 2) actor.animationName = 'move-1';
      else if (4 * 2 <= step && step < 6 * 2) actor.animationName = 'move-3';
    },
  },
  
  ATTACK: {
    type: ACTION_TYPES.STANDARD,
    steps: 15,
    script: function (app, actor, action, actionAttr, step) {
      if (step < 10) {

        actor.animationName = 'attack-windup';

      } else if (step === 10) {

        const particle = new Particle(app, {
          x: actor.x + Math.cos(actor.rotation) * actor.size * 0.8,
          y: actor.y + Math.sin(actor.rotation) * actor.size * 0.8,
          size: actor.size * 1,
          duration: 5,
          source: actor,
          ignoreSource: true,
          stats: {
            attackPower: 20,
            pushPower: 8,
            pushAngle: actor.rotation,
            pushDuration: 6,
            pushDecay: 1,
          },
          scripts: {
            'collision': function (app, particle, target) {
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

        actor.animationName = 'attack-active';

      } else {

        actor.animationName = 'attack-winddown';

      }
    }
  },
  
  DASH: {
    type: ACTION_TYPES.STANDARD,
    steps: 6,
    script: function (app, actor, action, actionAttr, step) {
      actor.animationName = 'dash';
      
      const power = (actor.stats.maxSpeed)
        ? actor.stats.maxSpeed * 3  * (6 - step) / 6
        : 0;
      actor.pushX += power * Math.cos(actor.rotation);
      actor.pushY += power * Math.sin(actor.rotation);

    }
  },
};
