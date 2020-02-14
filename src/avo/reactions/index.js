export const STANDARD_REACTIONS = {
  
  DAMAGE: {
    onAdd: function ({ app, actor, effect }) {},
    always: function ({ app, actor, effect }) {},
    onRemove: function ({ app, actor, effect }) {},
  },
  
  PUSH: {
    onAdd: function ({ app, actor, effect }) { console.log('NEW PUSH!') },
    
    always: function ({ app, actor, effect, timeStep }) {  // TODO: change name of 'actor' to 'entity'
      const power = effect.attr && effect.attr.power || 0;
      const angle = effect.attr && effect.attr.angle || 0;
      actor.pushX += power * Math.cos(angle);
      actor.pushY += power * Math.sin(angle);

      if (effect.attr.decay && effect.attr.power) {
        effect.attr.power = Math.max(effect.attr.power - effect.attr.decay, 0);
      }
    },
    
    onRemove: function (app, actor, effect) { console.log('PUSH FINISHED!') },
  }
  
};
