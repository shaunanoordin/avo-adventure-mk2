export const STANDARD_REACTIONS = {
  DAMAGE: function (app, actor, effect) {},
  
  PUSH: function (app, actor, effect) {
    const power = effect.attr && effect.attr.power || 0;
    const angle = effect.attr && effect.attr.angle || 0;
    actor.pushX += power * Math.cos(angle);
    actor.pushY += power * Math.sin(angle);

    if (effect.attr.decay && effect.attr.power) {
      effect.attr.power = Math.max(effect.attr.power - effect.attr.decay, 0);
    }
  },
  
};
