import { MODES } from './constants';
import ImageAsset from './image-asset';

class Story {
  constructor (app) {
    // Assets
    app.assets.basicActor = new ImageAsset('assets/actor-v1.png');
    
    //app.addActor();
    //app.addAsset();
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