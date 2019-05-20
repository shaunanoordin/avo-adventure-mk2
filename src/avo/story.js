import { MODES } from './constants';
import ImageAsset from './image-asset';

class Story {
  constructor (app) {
    // Assets
    app.assets.basicActor = new ImageAsset('assets/actor-v1.png');
    
    //app.addActor();
    //app.addActor();
    //app.addAsset();
  }
  
  start (app) {
    console.info('READY TO START!');
    app.mode = MODES.ACTION;
  }
  
  prePlay (app) {}
  skipPlay () { return false }
  postPlay (app) {}
  
  prePaint (app) {}
  skipPaint () { return false }
  postPaint (app) {}
}

export default Story;