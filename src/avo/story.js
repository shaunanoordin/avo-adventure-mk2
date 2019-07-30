import { MODES } from '@avo/misc/constants';
import ImageAsset from '@avo/misc/image-asset';
import Actor from '@avo/story-elements/actor';

class Story {
  constructor (app) {
    // Assets
    app.assets.basicActor = new ImageAsset('assets/actor-v1.png');
    
    app.playerActor = new Actor(app, { x: 160, y: 120 });
    app.actors['player'] = app.playerActor;
    
    // TODO:
    // app.addActor();
    // app.addAsset();
  }
  
  start (app) {
    console.info('STORY IS READY TO START!');
    app.changeMode(MODES.ACTION);
  }
  
  skipPlay () { return false }
  customPlay (app) {}
  
  skipPaint () { return false }
  customPaint (app) {}
}

export default Story;