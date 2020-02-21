export const STANDARD_REACTIONS = {
  
  DAMAGE: {
    onAdd: function ({ app, element, effect }) {},
    always: function ({ app, element, effect }) {},
    onRemove: function ({ app, element, effect }) {},
  },
  
  PUSH: {
    onAdd: function ({ app, element, effect }) { console.log('NEW PUSH!') },
    
    always: function ({ app, element, effect, timeStep }) {
      
      //TODO: Calculate how timeStep factors into the push's decay
      
      const power = effect.attr && effect.attr.power || 0;
      const angle = effect.attr && effect.attr.angle || 0;
      element.pushX += power * Math.cos(angle);
      element.pushY += power * Math.sin(angle);

      if (effect.attr.decay && effect.attr.power) {
        effect.attr.power = Math.max(effect.attr.power - effect.attr.decay * timeStep / 1000, 0);
      }
    },
    
    onRemove: function ({ app, element, effect }) { console.log('PUSH FINISHED!') },
  }
  
};
