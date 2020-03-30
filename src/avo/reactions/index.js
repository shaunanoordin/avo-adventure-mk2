export const STANDARD_REACTIONS = {
  
  DAMAGE: {
    onAdd: function ({ app, entity, effect }) {},
    always: function ({ app, entity, effect }) {},
    onRemove: function ({ app, entity, effect }) {},
  },
  
  PUSH: {
    onAdd: function ({ app, entity, effect }) { console.log('NEW PUSH!') },
    
    always: function ({ app, entity, effect, timeStep }) {
      
      const power = effect.attr && effect.attr.power || 0;
      const angle = effect.attr && effect.attr.angle || 0;
      entity.pushX += power * timeStep / 1000 * Math.cos(angle);
      entity.pushY += power * timeStep / 1000 * Math.sin(angle);

      if (effect.attr.decay && effect.attr.power) {
        effect.attr.power = Math.max(effect.attr.power - effect.attr.decay * timeStep / 1000, 0);
      }
    },
    
    onRemove: function ({ app, entity, effect }) { console.log('PUSH FINISHED!') },
  }
  
};
